// src/pages/admin/posts/index.tsx

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
import type { Key } from 'react';
import { useNavigate } from 'react-router';
import {
  CheckCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
  RestOutlined,
  SaveOutlined,
  StarOutlined,
} from '@ant-design/icons';

import {
  PostStatus,
  usePosts,
  usePublishPost,
  useUnpublishPost,
  useDeletePost,
} from '@/features/blog';
import type { BlogPost } from '@/entities/blog';

export function AdminPostsPage() {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<PostStatus | undefined>();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSize, setCurrentPageSize] = useState(20);

  const {
    posts: items,
    total,
    loading,
    refetch,
  } = usePosts({ status: statusFilter, keyword: searchKeyword, page: currentPage, pageSize: currentPageSize });

  const { publishPost, loading: publishing } = usePublishPost();
  const { unpublishPost, loading: unpublishing } = useUnpublishPost();
  const { deletePost, loading: deleting } = useDeletePost();

  const filteredPosts = items.filter((post) => {
    if (!searchKeyword) return true;
    const keyword = searchKeyword.toLowerCase();
    return post.title.toLowerCase().includes(keyword);
  });

  const handlePublish = async (post: BlogPost) => {
    await publishPost(post.id);
    await refetch();
  };

  const handleUnpublish = async (post: BlogPost) => {
    await unpublishPost(post.id);
    await refetch();
  };

  const handleDelete = async (post: BlogPost) => {
    await deletePost(post.id);
    await refetch();
  };

  const handleBatchDelete = async () => {
    for (const id of selectedRowKeys) {
      await deletePost(Number(id));
    }
    setSelectedRowKeys([]);
    await refetch();
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (keys: Key[]) => setSelectedRowKeys(keys),
  };

  const columns = [
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
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
      render: (status: PostStatus) => {
        let color = 'default';
        let text = '未知';
        let icon = null;

        switch (status) {
          case PostStatus.DRAFT:
            color = 'default';
            text = '草稿';
            icon = <SaveOutlined />;
            break;
          case PostStatus.PUBLISHED:
            color = 'green';
            text = '已发布';
            icon = <CheckCircleOutlined />;
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
      title: '置顶',
      dataIndex: 'isTop',
      key: 'isTop',
      width: 80,
      align: 'center' as const,
      render: (isTop: boolean) =>
        isTop ? (
          <StarOutlined style={{ color: '#faad14' }} />
        ) : null,
    },
    {
      title: '阅读量',
      dataIndex: 'viewCount',
      key: 'viewCount',
      width: 80,
      align: 'center' as const,
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
      render: (date: Date) => new Date(date).toLocaleString('zh-CN'),
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: 150,
      render: (date: Date) => new Date(date).toLocaleString('zh-CN'),
    },
    {
      title: '操作',
      key: 'actions',
      width: 200,
      render: (_: unknown, record: BlogPost) => (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <Button
            size="small"
            icon={<EyeOutlined />}
            onClick={() =>
              window.open(`/blog/${record.slug}`, '_blank')
            }
          >
            预览
          </Button>
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => navigate(`/admin/posts/${record.id}`)}
          >
            编辑
          </Button>
          {record.status === PostStatus.DRAFT && (
            <Button
              type="primary"
              size="small"
              loading={publishing}
              onClick={() => handlePublish(record)}
            >
              发布
            </Button>
          )}
          {record.status === PostStatus.PUBLISHED && (
            <Button
              size="small"
              loading={unpublishing}
              onClick={() => handleUnpublish(record)}
            >
              下架
            </Button>
          )}
          <Popconfirm
            title="确定删除这篇文章吗？"
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
      ),
    },
  ];

  const statusOptions = [
    { value: undefined, label: '全部' },
    { value: PostStatus.DRAFT, label: '草稿' },
    { value: PostStatus.PUBLISHED, label: '已发布' },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Card
        title="文章管理"
        extra={
          <div style={{ display: 'flex', gap: 8 }}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => navigate('/admin/posts/new')}
            >
              新建文章
            </Button>
            <Button
              type="text"
              icon={<RestOutlined />}
              onClick={() => refetch()}
              loading={loading}
            >
              刷新
            </Button>
          </div>
        }
      >
        <div
          style={{
            display: 'flex',
            gap: 16,
            marginBottom: 16,
            flexWrap: 'wrap',
            alignItems: 'center',
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
            placeholder="搜索标题"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            allowClear
          />
          {selectedRowKeys.length > 0 && (
            <Popconfirm
              title={`确定删除选中的 ${selectedRowKeys.length} 篇文章吗？`}
              onConfirm={handleBatchDelete}
              okText="确定"
              cancelText="取消"
            >
              <Button danger loading={deleting}>
                批量删除 ({selectedRowKeys.length})
              </Button>
            </Popconfirm>
          )}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 40 }}>
            <Spin size="large" />
          </div>
        ) : filteredPosts.length === 0 ? (
          <Empty description="暂无文章" />
        ) : (
          <Table
            dataSource={filteredPosts}
            columns={columns}
            rowKey="id"
            rowSelection={rowSelection}
            pagination={{
              total: total,
              current: currentPage,
              pageSize: currentPageSize,
              showSizeChanger: true,
              showTotal: (total) => `共 ${total} 条`,
              onChange: (page, pageSize) => {
                setCurrentPage(page);
                setCurrentPageSize(pageSize);
              },
            }}
            scroll={{ x: 1200 }}
          />
        )}
      </Card>
    </div>
  );
}
