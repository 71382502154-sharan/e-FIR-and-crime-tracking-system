import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { FIR, User, Role, FIRStatus, CaseEntity, CaseLink, Evidence } from '../types';

export type Language = 'en' | 'kn' | 'hi' | 'ta' | 'te';

interface AppState {
  language: Language;
  setLanguage: (lang: Language) => void;
  user: User | null;
  registeredUsers: User[];
  firs: FIR[];
  login: (id: string, role: Role, password?: string) => { success: boolean; message?: string };
  signup: (userData: { id: string; role: Role; name: string; phone?: string; email?: string; area?: string; station?: string; password?: string }) => { success: boolean; message?: string };
  logout: () => void;
  updateProfile: (name: string, phone?: string, email?: string, area?: string) => void;
  addFIR: (fir: Omit<FIR, 'id' | 'firNumber' | 'status' | 'dateFiled'>) => void;
  updateFIRStatus: (id: string, status: FIRStatus) => void;
  assignOfficer: (firId: string, officerId: string) => void;
  unassignOfficer: (firId: string, officerId: string) => void;
  addFIRNote: (firId: string, content: string, authorId: string, authorName: string) => void;
  updateFIREntities: (firId: string, entities: CaseEntity[], links: CaseLink[]) => void;
  addFIREvidence: (firId: string, evidence: Omit<Evidence, 'id'>) => void;
  customGeoPoints: any[];
  addCustomGeoPoint: (point: any) => void;
  removeCustomGeoPoint: (id: string | number) => void;
  customPolygons: any[];
  addCustomPolygon: (polygon: any) => void;
  removeCustomPolygon: (id: string | number) => void;
}

const INITIAL_FIRS: FIR[] = [
  {
    id: '1',
    firNumber: 'KA-FIR-2023-1042',
    title: 'Robbery at 1st Cross',
    description: 'Armed robbery at 1st cross jewel store around midnight. Suspects cut power lines prior to entry.',
    dateFiled: '2023-10-24T09:15:00Z',
    station: 'Central Zone, KA',
    status: 'Pending Assignment',
    severity: 'High',
    type: 'Robbery',
    location: '12.9716, 77.5946 (Indiranagar, Bengaluru)',
    evidence: [
      { id: 'EVID-1', title: 'CCTV Footage - Main Gate', type: 'video', url: '#' },
      { id: 'EVID-2', title: 'Broken Lock Photo', type: 'image', url: '#' }
    ],
    entities: [
      { id: 'Suspect C (Kumar)', name: 'Suspect C (Kumar)', type: 'suspect' },
      { id: 'Suspect A (Ravi)', name: 'Suspect A (Ravi)', type: 'suspect' },
      { id: 'Location: Indiranagar', name: 'Location: Indiranagar', type: 'location' },
      { id: 'Location: MG Road', name: 'Location: MG Road', type: 'location' },
      { id: 'Victim B (Tech Co.)', name: 'Victim B (Tech Co.)', type: 'victim' },
      { id: 'MO: Armed Break-in', name: 'MO: Armed Break-in', type: 'mo' }
    ],
    links: [
      { source: 'Suspect C (Kumar)', target: 'Location: Indiranagar', value: 2 },
      { source: 'Suspect C (Kumar)', target: 'Location: MG Road', value: 1 },
      { source: 'Location: MG Road', target: 'Suspect A (Ravi)', value: 2 },
      { source: 'Suspect A (Ravi)', target: 'Victim B (Tech Co.)', value: 2 },
      { source: 'Suspect A (Ravi)', target: 'MO: Armed Break-in', value: 3 },
      { source: 'Victim B (Tech Co.)', target: 'MO: Armed Break-in', value: 1 }
    ],
    aiAnalysis: {
      riskScore: 88,
      summary: 'High-risk organized robbery with pre-meditated surveillance and power-cutting MO. Matches active local syndicate tactics.',
      suspectsIdentified: ['Kumar (Suspect C)', 'Ravi (Suspect A)'],
      moPattern: 'Armed Break-in & Power Line Disruption',
      recommendedActions: [
        'Issue APB for silver getaway vehicle seen near MG Road',
        'Cross-examine CCTV feeds from Indiranagar junction',
        'Review recent power-tampering police logs in Central Zone'
      ]
    }
  },
  {
    id: '2',
    firNumber: 'KA-FIR-2023-1041',
    title: 'Cyber Fraud Online Scam',
    description: 'Victim duped into sharing OTP via spoofed banking portal link resulting in unauthorized transfer of ₹2,50,000.',
    dateFiled: '2023-10-23T14:30:00Z',
    station: 'Central Zone, KA',
    status: 'Under Investigation',
    severity: 'Medium',
    type: 'Cyber Fraud',
    location: '12.9279, 77.6271 (Koramangala, Bengaluru)',
    evidence: [
      { id: 'EVID-3', title: 'Transaction Screenshot', type: 'image', url: '#' },
      { id: 'EVID-4', title: 'Phishing SMS Header Log', type: 'document', url: '#' }
    ],
    entities: [
      { id: 'Suspect X (Telegram Alias)', name: 'Suspect X (Telegram Alias)', type: 'suspect' },
      { id: 'Victim: Anand Sharma', name: 'Victim: Anand Sharma', type: 'victim' },
      { id: 'Location: Koramangala', name: 'Location: Koramangala', type: 'location' },
      { id: 'MO: OTP Phishing', name: 'MO: OTP Phishing', type: 'mo' }
    ],
    links: [
      { source: 'Suspect X (Telegram Alias)', target: 'MO: OTP Phishing', value: 3 },
      { source: 'Suspect X (Telegram Alias)', target: 'Victim: Anand Sharma', value: 2 },
      { source: 'Victim: Anand Sharma', target: 'Location: Koramangala', value: 1 },
      { source: 'Location: Koramangala', target: 'MO: OTP Phishing', value: 1 }
    ],
    aiAnalysis: {
      riskScore: 65,
      summary: 'Phishing scam linked to interstate digital banking mule network operating via encrypted chat channels.',
      suspectsIdentified: ['Telegram Handler @FinSecOps'],
      moPattern: 'SMS Spoofing & Phishing OTP Drain',
      recommendedActions: [
        'Lien request sent to beneficiary bank account',
        'Request IP address logs from telecom service provider',
        'Issue public cyber-safety advisory regarding bank SMS headers'
      ]
    }
  },
  {
    id: '3',
    firNumber: 'KA-FIR-2023-1039',
    title: 'Vehicle Theft at Metro Station',
    description: 'Two-wheeler stolen from unmonitored parking space outside Metro station during daytime hours.',
    dateFiled: '2023-10-22T11:00:00Z',
    station: 'Central Zone, KA',
    status: 'Pending Verification',
    severity: 'Low',
    type: 'Vehicle Theft',
    location: '12.9783, 77.5717 (Majestic, Bengaluru)',
    evidence: [
      { id: 'EVID-5', title: 'Parking Ticket Slip', type: 'document', url: '#' }
    ],
    entities: [
      { id: 'Suspect Y (Unknown Lifter)', name: 'Suspect Y (Unknown Lifter)', type: 'suspect' },
      { id: 'Victim: Suresh M', name: 'Victim: Suresh M', type: 'victim' },
      { id: 'Location: Majestic Metro', name: 'Location: Majestic Metro', type: 'location' },
      { id: 'MO: Key Ignition Bypassing', name: 'MO: Key Ignition Bypassing', type: 'mo' }
    ],
    links: [
      { source: 'Suspect Y (Unknown Lifter)', target: 'MO: Key Ignition Bypassing', value: 2 },
      { source: 'Suspect Y (Unknown Lifter)', target: 'Location: Majestic Metro', value: 2 },
      { source: 'Victim: Suresh M', target: 'Location: Majestic Metro', value: 1 }
    ],
    aiAnalysis: {
      riskScore: 42,
      summary: 'Isolated vehicle theft with high likelihood of stolen vehicle being moved out of city limits within 48 hours.',
      suspectsIdentified: ['Unknown Bike Lifter Gang'],
      moPattern: 'Master Key Ignition Bypass',
      recommendedActions: [
        'Alert toll plazas on Outer Ring Road and Tumakuru Highway',
        'Review Metro parking CCTV cameras from 09:00 to 11:00'
      ]
    }
  }
];

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      language: 'en',
      setLanguage: (language) => set({ language }),
      user: null,
      registeredUsers: [
        { id: '123456789012', role: 'citizen', name: 'Ravi Kumar', phone: '9876543210', email: 'ravi@example.com', area: 'Indiranagar, Bengaluru' },
        { id: 'OFFICER001', role: 'officer', name: 'Saisriram Sr', station: 'Central Zone, KA', area: 'Central Zone, KA' },
        { id: 'ksp@2026.government.in', role: 'admin', name: 'System Admin', password: '16092007' }
      ],
      firs: INITIAL_FIRS,
      customGeoPoints: [],
      addCustomGeoPoint: (point) => set((state) => ({ customGeoPoints: [...state.customGeoPoints, point] })),
      removeCustomGeoPoint: (id) => set((state) => ({ customGeoPoints: state.customGeoPoints.filter(p => p.id !== id) })),
      customPolygons: [],
      addCustomPolygon: (polygon) => set((state) => ({ customPolygons: [...state.customPolygons, polygon] })),
      removeCustomPolygon: (id) => set((state) => ({ customPolygons: state.customPolygons.filter(p => p.id !== id) })),
      login: (id, role, password) => {
        if (role === 'admin' && id === 'ksp@2026.government.in' && password === '16092007') {
          const adminUser = { id: 'ksp@2026.government.in', role: 'admin' as const, name: 'System Admin', password: '16092007' };
          set({ user: adminUser });
          return { success: true, message: 'Admin login successful!' };
        }
        
        const state = get();
        const existingUser = state.registeredUsers.find(
          u => u.id.trim().toLowerCase() === id.trim().toLowerCase() && u.role === role
        );
        
        if (!existingUser) {
          return {
            success: false,
            message: `User ID '${id}' is not registered as a ${role}. Please sign up first.`
          };
        }

        if (existingUser.password && password && existingUser.password !== password) {
          return {
            success: false,
            message: 'Incorrect password. Please try again.'
          };
        }

        set({ user: existingUser });
        return {
          success: true,
          message: `Welcome back, ${existingUser.name}!`
        };
      },
      signup: (userData) => {
        const state = get();
        const existingUser = state.registeredUsers.find(
          u => u.id.trim().toLowerCase() === userData.id.trim().toLowerCase()
        );

        if (existingUser) {
          return {
            success: false,
            message: `User ID '${userData.id}' is already registered. Please log in instead.`
          };
        }

        const newUser: User = {
          id: userData.id.trim(),
          role: userData.role,
          name: userData.name,
          phone: userData.phone,
          email: userData.email,
          area: userData.area,
          station: userData.station || (userData.role === 'officer' ? userData.area : undefined),
          password: userData.password
        };

        set({
          user: newUser,
          registeredUsers: [...state.registeredUsers, newUser]
        });

        return {
          success: true,
          message: `Account created successfully! Welcome, ${newUser.name}.`
        };
      },
      logout: () => set({ user: null }),
      updateProfile: (name, phone, email, area) => set((state) => {
        if (!state.user) return state;
        const updatedUser = { 
          ...state.user, 
          name, 
          phone, 
          email, 
          area,
          ...(state.user.role === 'officer' ? { station: area } : {})
        };
        const updatedRegisteredUsers = state.registeredUsers.map(u => 
          (u.id === state.user?.id && u.role === state.user?.role) ? updatedUser : u
        );
        return { user: updatedUser, registeredUsers: updatedRegisteredUsers };
      }),
      addFIR: (firData) => set((state) => {
        const firId = Math.random().toString(36).substr(2, 9);
        const firNum = `KA-FIR-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
        const newFir: FIR = {
          ...firData,
          id: firId,
          userId: state.user?.id,
          firNumber: firNum,
          status: 'Pending Verification',
          dateFiled: new Date().toISOString(),
          entities: [
            { id: `Suspect for ${firNum}`, name: `Suspect in ${firData.title}`, type: 'suspect' },
            { id: `Victim in ${firNum}`, name: state.user?.name || 'Complainant', type: 'victim' },
            { id: `Location: ${firData.station || 'Jurisdiction'}`, name: `Location: ${firData.station || 'Jurisdiction'}`, type: 'location' },
            { id: `MO: ${firData.type}`, name: `MO: ${firData.type}`, type: 'mo' }
          ],
          links: [
            { source: `Suspect for ${firNum}`, target: `Location: ${firData.station || 'Jurisdiction'}`, value: 1 },
            { source: `Suspect for ${firNum}`, target: `MO: ${firData.type}`, value: 2 },
            { source: `Victim in ${firNum}`, target: `Location: ${firData.station || 'Jurisdiction'}`, value: 1 }
          ],
          aiAnalysis: {
            riskScore: firData.severity === 'High' ? 85 : firData.severity === 'Medium' ? 60 : 35,
            summary: `Automated analysis initialized for ${firData.title}. Pattern matching pending police verification.`,
            suspectsIdentified: ['Under Investigation'],
            moPattern: firData.type,
            recommendedActions: [
              'Verify complainant credentials and statements',
              'Inspect incident site and gather physical / digital logs'
            ]
          }
        };
        return { firs: [newFir, ...state.firs] };
      }),
      addFIRNote: (firId, content, authorId, authorName) => set((state) => {
        const newNote = {
          id: Math.random().toString(36).substr(2, 9),
          authorId,
          authorName,
          content,
          createdAt: new Date().toISOString()
        };
        return {
          firs: state.firs.map(fir => fir.id === firId ? { ...fir, notes: [...(fir.notes || []), newNote] } : fir)
        };
      }),
      updateFIRStatus: (id, status) => set((state) => ({
        firs: state.firs.map(fir => fir.id === id ? { ...fir, status } : fir)
      })),
      assignOfficer: (firId, officerId) => set((state) => ({
        firs: state.firs.map(fir => {
          if (fir.id === firId) {
            const assignedOfficers = fir.assignedOfficers || [];
            if (!assignedOfficers.includes(officerId)) {
              return { ...fir, assignedOfficers: [...assignedOfficers, officerId] };
            }
          }
          return fir;
        })
      })),
      unassignOfficer: (firId, officerId) => set((state) => ({
        firs: state.firs.map(fir => {
          if (fir.id === firId) {
            const assignedOfficers = fir.assignedOfficers || [];
            return { ...fir, assignedOfficers: assignedOfficers.filter(id => id !== officerId) };
          }
          return fir;
        })
      })),
      updateFIREntities: (firId, entities, links) => set((state) => ({
        firs: state.firs.map(fir => fir.id === firId ? { ...fir, entities, links } : fir)
      })),
      addFIREvidence: (firId, evidence) => set((state) => ({
        firs: state.firs.map(fir => fir.id === firId ? {
          ...fir,
          evidence: [...(fir.evidence || []), { ...evidence, id: `EVID-${Date.now()}` }]
        } : fir)
      }))
    }),
    {
      name: 'ksp-fir-storage',
    }
  )
);
