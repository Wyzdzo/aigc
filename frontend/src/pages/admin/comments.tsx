// src/pages/admin/comments.tsx

import { useState } from 'react';

import {
  Button,
  Card,
  Empty,
  Input,
  Popconfirm,
  Select,
  Spin,
  Table,
  Tag,
  Tooltip,
} from 'antd';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  EyeOutlined,
  RestOutlined,
} from '@ant-design/icons';

import {
  CommentStatus,
  useAdminComments,
  useDeleteComment,
  useUpdateCommentStatus,
} from '@/features/blog';
import type { BlogComment } from '@/entities/blog';

export function AdminCommentsPage() {
  const [statusFilter, setStatusFilter] = useState<CommentStatus | undefined>();
  const [searchKeyword, setSearchKeyword] = useState('');

  const {
    items: comments,
    total,
    currentPage,
    pageSize,
    loading,
    refetch,
  } = useAdminComments({ status: statusFilter, page: 1, pageSize: 20 });

  const { updateCommentStatus, loading: updatingStatus } = useUpdateCommentStatus();
  const { deleteComment, loading: deleting } = useDeleteComment();

  const filteredComments = comments.filter((comment) => {
    if (!searchKeyword) return true;
    const keyword = searchKeyword.toLowerCase();
    return (
      comment.nickname.toLowerCase().includes(keyword) ||
      comment.email.toLowerCase().includes(keyword) ||
      comment.content.toLowerCase().includes(keyword)
    );
  });

  const handleApprove = async (comment: BlogComment) => {
    await updateCommentStatus(comment.id, CommentStatus.APPROVED);
    await refetch();
  };

  const handleReject = async (comment: BlogComment) => {
    await updateCommentStatus(comment.id, CommentStatus.REJECTED);
    await refetch();
  };

  const handleDelete = async (comment: BlogComment) => {
    await deleteComment(comment.id);
    await refetch();
  };

  const columns = [
    {
      title: '昵称',
      dataIndex: 'nickname',
      key: 'nickname',
      width: 120,
      ellipsis: true,
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
      width: 180,
      ellipsis: true,
    },
    {
      title: '内容',
      dataIndex: 'content',
      key: 'content',
      ellipsis: {
        showTitle: false,
      },
      render: (text: string) => (
        <Tooltip title={text}>
          {text}
        </Tooltip>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: CommentStatus) => {
        let color = 'default';
        let text = '未知';
        let icon = null;

        switch (status) {
          case CommentStatus.PENDING:
            color = 'orange';
            text = '待审核';
            icon = <EyeOutlined />;
            break;
          case CommentStatus.APPROVED:
            color = 'green';
            text = '已通过';
            icon = <CheckCircleOutlined />;
            break;
          case CommentStatus.REJECTED:
            color = 'red';
            text = '已拒绝';
            icon = <CloseCircleOutlined />;
            break;
        }

        return (
          <Tag color={color}>
            {icon}
            <span style={{ marginLeft: 4 }}>{text}</span>
          </Tag>
        );
      },
    },
    {
      title: '点赞数',
      dataIndex: 'likeCount',
      key: 'likeCount',
      width: 80,
      align: 'center' as const,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
      render: (date: Date) => {
        return new Date(date).toLocaleString('zh-CN');
      },
    },
    {
      title: '操作',
      key: 'actions',
      width: 200,
      render: (_: unknown, record: BlogComment) => {
        return (
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {record.status !== CommentStatus.APPROVED && (
              <Button
                type="primary"
                size="small"
                loading={updatingStatus}
                onClick={() => handleApprove(record)}
              >
                批准
              </Button>
            )}
            {record.status !== CommentStatus.REJECTED && (
              <Button
                size="small"
                loading={updatingStatus}
                onClick={() => handleReject(record)}
              >
                拒绝
              </Button>
            )}
            <Popconfirm
              title="确定删除这条评论吗？"
              onConfirm={() => handleDelete(record)}
              okText="确定"
              cancelText="取消"
            >
              <Button
                danger
                size="small"
                loading={deleting}
                icon={<DeleteOutlined />}
              >
                删除
              </Button>
            </Popconfirm>
          </div>
        );
      },
    },
  ];

  const statusOptions = [
    { value: undefined, label: '全部' },
    { value: CommentStatus.PENDING, label: '待审核' },
    { value: CommentStatus.APPROVED, label: '已通过' },
    { value: CommentStatus.REJECTED, label: '已拒绝' },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Card
        title="评论管理"
        extra={
          <Button
            type="text"
            icon={<RestOutlined />}
            onClick={() => refetch()}
            loading={loading}
          >
            刷新
          </Button>
        }
      >
        <div
          style={{
            display: 'flex',
            gap: 16,
            marginBottom: 16,
            flexWrap: 'wrap',
          }}
        >
          <Select
            style={{ width: 160 }}
            placeholder="筛选状态"
            value={statusFilter}
            onChange={setStatusFilter}
            options={statusOptions}
          />
          <Input
            style={{ width: 280 }}
            placeholder="搜索昵称、邮箱或内容"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            allowClear
          />
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 40 }}>
            <Spin size="large" />
          </div>
        ) : filteredComments.length === 0 ? (
          <Empty description="暂无评论" />
        ) : (
          <Table
            dataSource={filteredComments}
            columns={columns}
            rowKey="id"
            pagination={{
              total: total,
              current: currentPage,
              pageSize: pageSize,
              showSizeChanger: true,
              showTotal: (total) => `共 ${total} 条`,
            }}
            scroll={{ x: 1000 }}
          />
        )}
      </Card>
    </div>
  );
}
