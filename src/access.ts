/**
 * @see https://umijs.org/docs/max/access#access
 * */
export default function access(initialState: { currentUser?: API.CurrentUser } | undefined) {
  const { currentUser } = initialState || {};
  return {
    canAdmin: currentUser && currentUser.roles?.includes('admin'),
    canEditQuest: currentUser && currentUser.permissions?.includes('quest.edit'),
    canViewDashboard: currentUser && currentUser.permissions?.includes('dashboard.view'),
  };
}

