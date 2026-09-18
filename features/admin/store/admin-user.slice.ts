import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface AdminUser {
  id: number
  name: string
  email: string
  dob?: string // YYYY/MM/DD
  phone?: string
  avatar?: string
  gender?: string
  homeAddress?: string
  workAddress?: string
  username?: string
}

interface AdminUserState {
  items: AdminUser[]
}

const INITIAL_USERS: AdminUser[] = [
  {
    id: 1,
    name: 'Dianne Russell',
    email: 'nevaeh.simmons@example.com',
    dob: '1989/04/06',
    phone: '063-222-1125',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
  },
  {
    id: 2,
    name: 'Leslie Alexander',
    email: 'curtis.weaver@example.com',
    dob: '1976/09/12',
    phone: '088-124-1555',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
  },
  {
    id: 3,
    name: 'Wade Warren',
    email: 'debbie.baker@example.com',
    dob: '1954/02/08',
    phone: '063-137-3355',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
  },
  {
    id: 4,
    name: 'Jane Cooper',
    email: 'nathan.roberts@example.com',
    dob: '1961/05/27',
    phone: '093-241-3262',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=80',
  },
  {
    id: 5,
    name: 'Bessie Cooper',
    email: 'debra.holt@example.com',
    dob: '1983/02/10',
    phone: '088-125-1671',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80',
  },
  {
    id: 6,
    name: 'Arlene McCoy',
    email: 'georgia.young@example.com',
    dob: '1969/03/05',
    phone: '082-141-2567',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
  },
  {
    id: 7,
    name: 'Theresa Webb',
    email: 'jessica.hanson@example.com',
    dob: '1983/02/10',
    phone: '095-242-1144',
    avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&auto=format&fit=crop&q=80',
  },
  {
    id: 8,
    name: 'Darrell Steward',
    email: 'dolores.chambers@example.com',
    dob: '1989/04/06',
    phone: '093-424-1253',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&auto=format&fit=crop&q=80',
  },
  {
    id: 9,
    name: 'Courtney Henry',
    email: 'michael.mitc@example.com',
    dob: '1990/12/14',
    phone: '088-172-3113',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80',
  },
  {
    id: 10,
    name: 'Savannah Nguyen',
    email: 'willie.jennings@example.com',
    dob: '1970/11/09',
    phone: '081-632-1256',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80',
  },
]

const adminUserSlice = createSlice({
  name: 'adminUsers',
  initialState: {
    items: INITIAL_USERS,
  } as AdminUserState,
  reducers: {
    addAdminUser: (state, action: PayloadAction<AdminUser>) => {
      state.items.unshift(action.payload)
    },
    setAdminUsers: (state, action: PayloadAction<AdminUser[]>) => {
      state.items = action.payload
    },
    deleteAdminUser: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((user) => user.id !== action.payload)
    },
    updateAdminUser: (state, action: PayloadAction<AdminUser>) => {
      const index = state.items.findIndex((user) => user.id === action.payload.id)
      if (index !== -1) {
        state.items[index] = action.payload
      }
    },
  },
})

export const { addAdminUser, setAdminUsers, deleteAdminUser, updateAdminUser } = adminUserSlice.actions
export default adminUserSlice.reducer
