// src/pages/admin/media.tsx

import { useState } from 'react';
import { Upload, Image, Modal, message, Card, Row, Col, Button, Input, Pagination, Spin, Typography } from 'antd';
import { UploadOutlined, DeleteOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import { useMediaList, useDeleteMedia } from '@/features/media';
import type { MediaItem } from '@/features/media';

const { Search } = Input;
const { Meta } = Card;
const { Title } = Typography;

export function AdminMediaPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [keyword, setKeyword] = useState<string | undefined>();
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');

  const { mediaList, loading, refetch } = useMediaList(page, pageSize, keyword);
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

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="p-6">
      <Title level={3}>文件管理</Title>

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
        {mediaList?.items && mediaList.items.length > 0 ? (
          <>
            <Row gutter={[16, 16]}>
              {mediaList.items.map((item) => (
                <Col key={item.id} xs={24} sm={12} md={8} lg={6}>
                  <Card
                    hoverable
                    onClick={() => handlePreview(item)}
                    cover={
                      <div className="flex h-[150px] items-center justify-center overflow-hidden bg-gray-100">
                        <Image
                          src={item.url}
                          alt={item.originalName}
                          preview={false}
                          className="max-h-full max-w-full object-contain"
                          fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
                        />
                      </div>
                    }
                    actions={[
                      <DeleteOutlined
                        key="delete"
                        onClick={() => handleDelete(item.id)}
                        disabled={deleteLoading}
                      />,
                    ]}
                  >
                    <Meta
                      title={item.originalName}
                      description={
                        <div>
                          <div>{formatFileSize(item.size)}</div>
                          <div>{item.width} x {item.height}</div>
                          <div>{new Date(item.createdAt).toLocaleDateString()}</div>
                        </div>
                      }
                    />
                  </Card>
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
          <div className="py-12 text-center text-gray-400">
            暂无文件，上传一张图片开始使用
          </div>
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
