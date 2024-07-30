import { Request, Response } from 'express';

const hierarchy = [
  {
    user_id: 123134,
    total_nts: 44345,
    total_user: 7,
    ancestor_path: '',
    total_activat_user: 7,
    invite_count: 7,
    invite_activat_count: 7,
    invite_nts: 0,
    total_block_nts: 0,
    total_block_user: 0,
  },
  {
    user_id: 101878,
    total_nts: 0,
    total_user: 0,
    ancestor_path: '',
    total_activat_user: 0,
    invite_count: 0,
    invite_activat_count: 0,
    invite_nts: 0,
    total_block_nts: 0,
    total_block_user: 0,
  },
  {
    user_id: 123706,
    total_nts: 83353,
    total_user: 13,
    ancestor_path: '',
    total_activat_user: 13,
    invite_count: 13,
    invite_activat_count: 13,
    invite_nts: 0,
    total_block_nts: 0,
    total_block_user: 0,
  },
  {
    user_id: 123756,
    total_nts: 51148,
    total_user: 9,
    ancestor_path: '',
    total_activat_user: 9,
    invite_count: 9,
    invite_activat_count: 9,
    invite_nts: 0,
    total_block_nts: 0,
    total_block_user: 0,
  },
];

const inviteUserHierarchy = [
  {
    user_id: 1237061,
    total_nts: 83353,
    total_user: 13,
    ancestor_path: '',
    total_activat_user: 13,
    invite_count: 13,
    invite_activat_count: 13,
    invite_nts: 0,
    total_block_nts: 0,
    total_block_user: 0,
  },
  {
    user_id: 1237562,
    total_nts: 51148,
    total_user: 9,
    ancestor_path: '',
    total_activat_user: 9,
    invite_count: 9,
    invite_activat_count: 9,
    invite_nts: 0,
    total_block_nts: 0,
    total_block_user: 0,
  },
];

const mockData = {
  code: 0,
  msg: 'Success',
};

const getExpandableList = (req: Request, res: Response) => {
  const { userId } = req.query;
  if (userId) {
    const findUser = hierarchy.find((item) => item.user_id === Number(userId));

    return res.json({
      ...mockData,
      data: {
        hierarchy: findUser,
        invite_user_hierarchy: inviteUserHierarchy,
      },
    });
  }

  return res.json({
    ...mockData,
    data: {
      hierarchy: hierarchy[0],
      invite_user_hierarchy: inviteUserHierarchy,
    },
  });
};

export default {
  'GET /v1/admin/hierarchy': getExpandableList,
};
