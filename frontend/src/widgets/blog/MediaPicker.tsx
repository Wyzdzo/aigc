// src/widgets/blog/MediaPicker.tsx

import { useState } from 'react';
import { Image, Input, Modal, Pagination, Row, Col, Spin, Empty } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

import { useMediaList } from '@/features/media';

export interface MediaPickerProps {
  open: boolean;
  onCancel: () => void;
  onSelect: (url: string, name: string) => void;
}

export function MediaPicker({ open, onCancel, onSelect }: MediaPickerProps) {
  const [page, setPage] = useState(1);
  const [keyword, setKeyword] = useState<string | undefined>();

  const { mediaList, loading, refetch } = useMediaList(page, 12, keyword);

  const handleSearch = (value: string) => {
    setKeyword(value || undefined);
    setPage(1);
  };

  const handleSelect = (url: string, name: string) => {
    onSelect(url, name);
    onCancel();
  };

  const handleOpen = () => {
    refetch();
    setPage(1);
    setKeyword(undefined);
  };

  return (
    <Modal
      title="从图片库选择"
      open={open}
      onCancel={onCancel}
      footer={null}
      width={800}
      afterOpenChange={(visible) => {
        if (visible) handleOpen();
      }}
    >
      <div className="mb-4">
        <Input.Search
          placeholder="搜索文件名"
          allowClear
          prefix={<SearchOutlined />}
          onSearch={handleSearch}
        />
      </div>

      <Spin spinning={loading}>
        {mediaList?.items && mediaList.items.length > 0 ? (
          <>
            <Row gutter={[12, 12]}>
              {mediaList.items.map((item) => (
                <Col key={item.id} xs={8} sm={6}>
                  <div
                    className="group relative cursor-pointer overflow-hidden rounded border"
                    style={{ borderColor: 'var(--ant-color-border)' }}
                    onClick={() => handleSelect(item.url, item.originalName)}
                  >
                    <div
                      className="flex h-[100px] items-center justify-center overflow-hidden"
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
                    </div>
                    <div className="truncate px-2 py-1 text-xs" style={{ color: 'var(--ant-color-text-secondary)' }}>
                      {item.originalName}
                    </div>
                  </div>
                </Col>
              ))}
            </Row>

            {mediaList.total > 12 && (
              <div className="mt-4 text-right">
                <Pagination
                  size="small"
                  current={page}
                  pageSize={12}
                  total={mediaList.total}
                  onChange={(p) => setPage(p)}
                  showTotal={(total) => `共 ${total} 个`}
                />
              </div>
            )}
          </>
        ) : (
          <Empty description="暂无图片" />
        )}
      </Spin>
    </Modal>
  );
}
