import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  query, 
  orderBy,
  Firestore
} from 'firebase/firestore';

// Types
export interface FeatureRequest {
  id: string;
  fullName: string;
  email: string;
  companyName: string;
  toolName: string;
  toolUrl: string;
  message: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  approvedAt: string | null;
  expiryDate: string | null;
}

export interface ToolFeaturedStatus {
  toolId: string;
  isFeatured: boolean;
  expiryDate: string | null;
  updatedAt: string;
}

export interface AnalyticsEvent {
  id: string;
  eventType: 'page_view' | 'outbound_click' | 'featured_click' | 'search' | 'submission';
  path: string;
  targetId: string;
  timestamp: string;
}

export interface AnalyticsSummary {
  totalViews: number;
  totalClicks: number;
  topTools: Array<{ toolId: string; count: number }>;
  topCategories: Array<{ category: string; count: number }>;
  featuredClicks: Array<{ toolId: string; count: number }>;
}

// 1. Firebase configuration check
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const isFirebaseConfigured = !!(
  firebaseConfig.apiKey && 
  firebaseConfig.projectId && 
  firebaseConfig.appId
);

let db: Firestore | null = null;

if (isFirebaseConfigured) {
  try {
    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    db = getFirestore(app);
    console.log('Firebase initialized successfully.');
  } catch (error) {
    console.error('Firebase initialization failed:', error);
  }
} else {
  console.log('Firebase credentials not set. Falling back to LocalStorage Database.');
}

// 2. Local Storage Database Fallback helper functions
const getLocalData = <T>(key: string): T[] => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

const setLocalData = <T>(key: string, data: T[]): void => {
  localStorage.setItem(key, JSON.stringify(data));
};

// 3. Database Operations (Hybrid logic)

// A. Feature Requests
export const submitFeatureRequest = async (
  requestData: Omit<FeatureRequest, 'id' | 'status' | 'submittedAt' | 'approvedAt' | 'expiryDate'>
): Promise<void> => {
  const newRequest: FeatureRequest = {
    ...requestData,
    id: Math.random().toString(36).substring(2, 9),
    status: 'pending',
    submittedAt: new Date().toISOString(),
    approvedAt: null,
    expiryDate: null
  };

  if (isFirebaseConfigured && db) {
    await addDoc(collection(db, 'feature_requests'), newRequest);
  } else {
    const requests = getLocalData<FeatureRequest>('neo_feature_requests');
    requests.push(newRequest);
    setLocalData('neo_feature_requests', requests);
  }
};

export const getFeatureRequests = async (): Promise<FeatureRequest[]> => {
  if (isFirebaseConfigured && db) {
    const q = query(collection(db, 'feature_requests'), orderBy('submittedAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return { ...data, id: doc.id } as FeatureRequest;
    });
  } else {
    const requests = getLocalData<FeatureRequest>('neo_feature_requests');
    return requests.sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));
  }
};

export const updateFeatureRequestStatus = async (
  requestId: string,
  status: 'approved' | 'rejected',
  expiryDate: string | null = null
): Promise<void> => {
  if (isFirebaseConfigured && db) {
    const docRef = doc(db, 'feature_requests', requestId);
    await updateDoc(docRef, {
      status,
      approvedAt: status === 'approved' ? new Date().toISOString() : null,
      expiryDate: status === 'approved' ? expiryDate : null
    });
  } else {
    const requests = getLocalData<FeatureRequest>('neo_feature_requests');
    const index = requests.findIndex(r => r.id === requestId);
    if (index !== -1) {
      requests[index].status = status;
      requests[index].approvedAt = status === 'approved' ? new Date().toISOString() : null;
      requests[index].expiryDate = status === 'approved' ? expiryDate : null;
      setLocalData('neo_feature_requests', requests);
    }
  }
};

// B. Featured Tools Status Management
export const getFeaturedToolsStatus = async (): Promise<Record<string, ToolFeaturedStatus>> => {
  if (isFirebaseConfigured && db) {
    const snapshot = await getDocs(collection(db, 'tool_featured_status'));
    const result: Record<string, ToolFeaturedStatus> = {};
    snapshot.docs.forEach(doc => {
      const data = doc.data() as ToolFeaturedStatus;
      result[data.toolId] = data;
    });
    return result;
  } else {
    const statusList = getLocalData<ToolFeaturedStatus>('neo_tool_featured_status');
    const result: Record<string, ToolFeaturedStatus> = {};
    statusList.forEach(item => {
      result[item.toolId] = item;
    });
    return result;
  }
};

export const updateToolFeaturedStatus = async (
  toolId: string,
  isFeatured: boolean,
  expiryDate: string | null = null
): Promise<void> => {
  const newStatus: ToolFeaturedStatus = {
    toolId,
    isFeatured,
    expiryDate,
    updatedAt: new Date().toISOString()
  };

  if (isFirebaseConfigured && db) {
    const docRef = doc(db, 'tool_featured_status', toolId);
    await updateDoc(docRef, newStatus as unknown as Record<string, unknown>).catch(async () => {
      // If doc doesn't exist, create it (not checking exists to minimize read hits)
      const { setDoc } = await import('firebase/firestore');
      await setDoc(doc(db, 'tool_featured_status', toolId), newStatus);
    });
  } else {
    const statusList = getLocalData<ToolFeaturedStatus>('neo_tool_featured_status');
    const index = statusList.findIndex(item => item.toolId === toolId);
    if (index !== -1) {
      statusList[index] = newStatus;
    } else {
      statusList.push(newStatus);
    }
    setLocalData('neo_tool_featured_status', statusList);
  }
};

// C. Analytics System
export const logAnalyticsEvent = async (
  eventType: AnalyticsEvent['eventType'],
  path: string,
  targetId: string = ''
): Promise<void> => {
  const event: AnalyticsEvent = {
    id: Math.random().toString(36).substring(2, 9),
    eventType,
    path,
    targetId,
    timestamp: new Date().toISOString()
  };

  if (isFirebaseConfigured && db) {
    await addDoc(collection(db, 'analytics'), event);
  } else {
    const events = getLocalData<AnalyticsEvent>('neo_analytics');
    // Keep max 5000 events locally to avoid performance issues
    if (events.length > 5000) {
      events.shift();
    }
    events.push(event);
    setLocalData('neo_analytics', events);
  }
};

export const getAnalyticsSummary = async (toolsList: { id: string; category: string }[] = []): Promise<AnalyticsSummary> => {
  let events: AnalyticsEvent[];

  if (isFirebaseConfigured && db) {
    const snapshot = await getDocs(collection(db, 'analytics'));
    events = snapshot.docs.map(doc => doc.data() as AnalyticsEvent);
  } else {
    events = getLocalData<AnalyticsEvent>('neo_analytics');
  }

  // 1. Total counts
  const totalViews = events.filter(e => e.eventType === 'page_view').length;
  const totalClicks = events.filter(e => e.eventType === 'outbound_click' || e.eventType === 'featured_click').length;

  // 2. Page views and clicks by tool
  const toolViews: Record<string, number> = {};
  const toolFeaturedClicks: Record<string, number> = {};
  const categoryClicks: Record<string, number> = {};

  // Map toolId to category for fast lookup
  const toolCategories: Record<string, string> = {};
  toolsList.forEach(t => {
    toolCategories[t.id] = t.category;
  });

  events.forEach(event => {
    // Top Tools (views + clicks)
    if (event.eventType === 'page_view' && event.path.startsWith('/tool/')) {
      const tId = event.targetId || event.path.split('/')[2];
      if (tId) {
        toolViews[tId] = (toolViews[tId] || 0) + 1;
      }
    }
    if (event.eventType === 'outbound_click') {
      const tId = event.targetId;
      if (tId) {
        toolViews[tId] = (toolViews[tId] || 0) + 1; // clicks contribute to tool weight
        
        // Group by category
        const cat = toolCategories[tId] || 'Other';
        categoryClicks[cat] = (categoryClicks[cat] || 0) + 1;
      }
    }

    // Featured clicks
    if (event.eventType === 'featured_click') {
      const tId = event.targetId;
      if (tId) {
        toolFeaturedClicks[tId] = (toolFeaturedClicks[tId] || 0) + 1;
      }
    }
  });

  const topTools = Object.keys(toolViews)
    .map(toolId => ({ toolId, count: toolViews[toolId] }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const topCategories = Object.keys(categoryClicks)
    .map(category => ({ category, count: categoryClicks[category] }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const featuredClicks = Object.keys(toolFeaturedClicks)
    .map(toolId => ({ toolId, count: toolFeaturedClicks[toolId] }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return {
    totalViews,
    totalClicks,
    topTools,
    topCategories,
    featuredClicks
  };
};
