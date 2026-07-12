// src/pages/admin/media.tsx

import { useState } from 'react';
import {
  Button,
  Col,
  Empty,
  Image,
  Input,
  message,
  Modal,
  Pagination,
  Popconfirm,
  Result,
  Row,
  Spin,
  Tooltip,
  Upload,
} from 'antd';
import {
  CopyOutlined,
  DeleteOutlined,
  EyeOutlined,
  ReloadOutlined,
  SearchOutlined,
  UploadOutlined,
} from '@ant-design/icons';

import { useDeleteMedia, useMediaList } from '@/features/media';
import type { MediaItem } from '@/features/media';

const { Search } = Input;

export function AdminMediaPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [keyword, setKeyword] = useState<string | undefined>();
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');

  const { mediaList, loading, error, refetch } = useMediaList(page, pageSize, keyword);
  const { deleteMedia, loading: deleteLoading } = useDeleteMedia();

  const handleUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch('/api/media/upload', {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });

      if (response.ok) {
        message.success('上传成功');
        refetch();
      } else {
        message.error('上传失败');
      }
    } catch {
      message.error('上传失败');
    }

    return false;
  };

  const handleDelete = async (id: number) => {
    const success = await deleteMedia(id);
    if (success) {
      message.success('删除成功');
      refetch();
    } else {
      message.error('删除失败');
    }
  };

  const handlePreview = (item: MediaItem) => {
    setPreviewImage(item.url);
    setPreviewVisible(true);
  };

  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url).then(
      () => message.success('链接已复制'),
      () => message.error('复制失败'),
    );
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="p-6">
      <h2 className="mb-4 text-xl font-semibold" style={{ color: 'var(--ant-color-text-heading)' }}>
        图片库
      </h2>

      <div className="mb-4 flex items-center gap-4">
        <Upload beforeUpload={handleUpload} showUploadList={false}>
          <Button type="primary" icon={<UploadOutlined />}>
            上传图片
          </Button>
        </Upload>

        <Search
          placeholder="搜索文件名"
          allowClear
          className="w-[300px]"
          prefix={<SearchOutlined />}
          onSearch={(value) => {
            setKeyword(value || undefined);
            setPage(1);
          }}
        />

        <Button icon={<ReloadOutlined />} onClick={() => refetch()}>
          刷新
        </Button>
      </div>

      <Spin spinning={loading}>
        {error ? (
          <Result
            status="error"
            title="加载图片列表失败"
            subTitle={error.message}
            extra={<Button onClick={() => refetch()}>重试</Button>}
          />
        ) : mediaList?.items && mediaList.items.length > 0 ? (
          <>
            <Row gutter={[16, 16]}>
              {mediaList.items.map((item) => (
                <Col key={item.id} xs={24} sm={12} md={8} lg={6}>
                  <div className="group relative overflow-hidden rounded-lg border" style={{ borderColor: 'var(--ant-color-border)' }}>
                    <div
                      className="relative flex h-[150px] items-center justify-center overflow-hidden"
                      style={{ backgroundColor: 'var(--ant-color-fill-quaternary)' }}
                    >
                      <div className="flex h-full items-center justify-center">
                        <Image
                          src={item.url}
                          alt={item.originalName}
                          preview={false}
                          style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
                          fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
                        />
                      </div>
                      <div
                        className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 transition-opacity group-hover:opacity-100"
                        style={{ backgroundColor: 'color-mix(in srgb, var(--ant-color-bg-container) 60%, transparent)' }}
                      >
                        <Tooltip title="预览">
                          <Button
                            type="text"
                            shape="circle"
                            icon={<EyeOutlined />}
                            onClick={() => handlePreview(item)}
                            style={{ color: 'var(--ant-color-text)' }}
                          />
                        </Tooltip>
                        <Tooltip title="复制链接">
                          <Button
                            type="text"
                            shape="circle"
                            icon={<CopyOutlined />}
                            onClick={() => handleCopyLink(item.url)}
                            style={{ color: 'var(--ant-color-text)' }}
                          />
                        </Tooltip>
                        <Popconfirm
                          title="确定删除这张图片吗？"
                          onConfirm={() => handleDelete(item.id)}
                          okText="确定"
                          cancelText="取消"
                        >
                          <Tooltip title="删除">
                            <Button
                              type="text"
                              shape="circle"
                              icon={<DeleteOutlined />}
                              loading={deleteLoading}
                              style={{ color: 'var(--ant-color-error)' }}
                            />
                          </Tooltip>
                        </Popconfirm>
                      </div>
                    </div>
                    <div className="p-3">
                      <div className="mb-1 truncate text-sm font-medium" style={{ color: 'var(--ant-color-text-heading)' }}>
                        {item.originalName}
                      </div>
                      <div className="text-xs" style={{ color: 'var(--ant-color-text-secondary)' }}>
                        {formatFileSize(item.size)} · {item.width} x {item.height}
                      </div>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>

            <div className="mt-4 text-right">
              <Pagination
                current={page}
                pageSize={pageSize}
                total={mediaList.total}
                onChange={(p, ps) => {
                  setPage(p);
                  setPageSize(ps);
                }}
                showSizeChanger
                showTotal={(total) => `共 ${total} 个文件`}
              />
            </div>
          </>
        ) : (
          <Empty description="暂无图片，上传一张开始使用" />
        )}
      </Spin>

      <Modal
        open={previewVisible}
        footer={null}
        onCancel={() => setPreviewVisible(false)}
        width={800}
      >
        <img alt="preview" className="w-full" src={previewImage} />
      </Modal>
    </div>
  );
}
