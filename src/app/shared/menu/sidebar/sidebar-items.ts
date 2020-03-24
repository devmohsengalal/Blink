// Menu
export interface Menu {
  path?: string;
  title?: string;
  icon?: string;
  type?: string;
  headTitle?: string,
  badgeType?: string;
  badgeValue?: string;
  children?: Menu[];
  role?:number;
}

export const MENUITEMS: Menu[] = [
   
  {
    path: '/dashboard/default', title: 'Dashboard', icon: 'icon-desktop', type: 'link',role:1
  },
  { 
    headTitle: 'General'
  },
  {
    title: 'Customer', icon: 'icon-crown', type: 'sub',role:2, children: [
      { title: 'Add Customer', type: 'link',path: '/dashboard/CustomerFormAdd',role:12 }, 
      {title: 'Customers List', type: 'link',path: '/dashboard/Customer' ,role:12},
      { title: 'Renew Subscription', type: 'link',path: '/dashboard/RenewSubscription',role:17 },
      {
        path: '/dashboard/SubscriptionType', title: 'Subscription Type', icon: 'icon-comment-alt', type: 'link',role:18
      }
    ]
  }
  ,
  {
    title: 'Account', icon: 'icon-panel', type: 'sub',role:1, children: [
      { title: 'Add Account', type: 'link',path: '/dashboard/AccountFormAdd',role:1 }, 
      {title: 'Accounts List', type: 'link',path: '/dashboard/Accounts',role:5 },
      { title: 'Add Role', type: 'link',path: '/dashboard/RolesFormAdd',role:6 }, 
      {title: 'Roles List', type: 'link',path: '/dashboard/RolesList',role:9 }  
    ]
  },
  
  {
    title: 'End User', icon: 'icon-user', type: 'sub',role:3, children: [
      {title: 'Import End User', type: 'link',path: '/dashboard/import-user-sheet',role:22 },
      { title: 'Add End User', type: 'link',path: '/dashboard/UserFormAdd',role:22 }, 
      {title: 'End User List', type: 'link',path: '/dashboard/UserManagement',role:26 },
  {
    path: '/dashboard/Group', title: 'Group', icon: 'icon-desktop', type: 'link',role:27
  }
    ]
  },
  {
    title: 'Vehicles', icon: 'icon-car', type: 'sub',role:4, children: [
      { title: 'Add Vehicles', type: 'link',path: '/dashboard/vehicle-formAdd',role:31 }, 
      {title: 'Vehicles List', type: 'link',path: '/dashboard/vehicle',role:34 }
    ]
  },
  { 
    headTitle: 'Reports'
  }, 
  {
    path: '/dashboard/AccidentReports', title: 'Accident Reports', icon: 'icon-info-alt', type: 'link',role:36
  },
  {
    path: '/dashboard/IncidentReports', title: 'Incident Reports', icon: 'icon-info-alt', type: 'link',role:35
  },

  {
    path: '/dashboard/TripReports', title: 'Trip Reports', icon: 'icon-car', type: 'link',role:37
  },
  {
    path: '/dashboard/Notifications', title: 'Notifications', icon: 'icon-medall-alt', type: 'link',role:46
  },
  { 
    headTitle: 'Settings',role:8
  }, 
  {
    path: '/dashboard/Countries', title: 'Countries', icon: 'icon-map', type: 'link',role:38
  },
  {
    path: '/dashboard/State', title: 'States', icon: 'icon-package', type: 'link',role:41
  },
]
