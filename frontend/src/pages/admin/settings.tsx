// src/pages/admin/settings.tsx

import { useState, useEffect } from 'react';
import {
  Card,
  Tabs,
  Form,
  Input,
  Button,
  message,
  Spin,
  Typography,
  Switch,
  InputNumber,
  Avatar,
  Upload,
} from 'antd';
import { UserOutlined, LockOutlined, SettingOutlined, UploadOutlined } from '@ant-design/icons';
import { useSettings, type UpdateSiteSettingsInput, type UpdateBloggerInfoInput, type UpdatePasswordInput } from '@/features/settings';

const { Title } = Typography;
const { TextArea } = Input;

export function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState('site');
  const [siteForm] = Form.useForm();
  const [bloggerForm] = Form.useForm();
  const [passwordForm] = Form.useForm();

  const {
    settings,
    loading,
    refetch,
    updateSiteSettings,
    updateSiteSettingsLoading,
    updateBloggerInfo,
    updateBloggerInfoLoading,
    updatePassword,
    updatePasswordLoading,
  } = useSettings();

  // 初始化表单数据
  useEffect(() => {
    if (settings) {
      // 网站设置表单
      const siteSettings: Record<string, string> = {};
      settings.siteSettings.forEach((s) => {
        siteSettings[s.key] = s.value || '';
      });
      siteForm.setFieldsValue({
        siteName: siteSettings['site_name'] || '',
        siteDescription: siteSettings['site_description'] || '',
        siteKeywords: siteSettings['site_keywords'] || '',
        announcement: siteSettings['site_announcement'] || '',
        perPage: Number(siteSettings['per_page']) || 10,
        allowComment: siteSettings['allow_comment'] === 'true',
      });

      // 博主信息表单
      if (settings.bloggerInfo) {
        bloggerForm.setFieldsValue({
          nickname: settings.bloggerInfo.nickname || '',
          bio: settings.bloggerInfo.bio || '',
        });
      }
    }
  }, [settings, siteForm, bloggerForm]);

  const handleSiteSettingsSubmit = async (values: UpdateSiteSettingsInput) => {
    const success = await updateSiteSettings(values);
    if (success) {
      message.success('网站设置已保存');
      refetch();
    } else {
      message.error('保存失败');
    }
  };

  const handleBloggerInfoSubmit = async (values: UpdateBloggerInfoInput) => {
    const success = await updateBloggerInfo(values);
    if (success) {
      message.success('博主信息已保存');
      refetch();
    } else {
      message.error('保存失败');
    }
  };

  const handlePasswordSubmit = async (values: UpdatePasswordInput) => {
    const success = await updatePassword(values);
    if (success) {
      message.success('密码已修改');
      passwordForm.resetFields();
    } else {
      message.error('修改失败，请检查旧密码是否正确');
    }
  };

  const handleAvatarUpload = async (file: File) => {
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
        const data = await response.json();
        bloggerForm.setFieldsValue({ avatar: data.url });
        message.success('头像上传成功');
      } else {
        message.error('上传失败');
      }
    } catch {
      message.error('上传失败');
    }

    return false;
  };

  const tabItems = [
    {
      key: 'site',
      label: '网站设置',
      icon: <SettingOutlined />,
      children: (
        <Spin spinning={loading}>
          <Form
            form={siteForm}
            layout="vertical"
            onFinish={handleSiteSettingsSubmit}
          >
            <Form.Item name="siteName" label="网站名称">
              <Input placeholder="请输入网站名称" />
            </Form.Item>

            <Form.Item name="siteDescription" label="网站描述">
              <TextArea rows={3} placeholder="请输入网站描述" />
            </Form.Item>

            <Form.Item name="siteKeywords" label="SEO关键词">
              <Input placeholder="请输入关键词，用逗号分隔" />
            </Form.Item>

            <Form.Item name="announcement" label="公告内容">
              <TextArea rows={3} placeholder="请输入公告内容，留空则不显示公告栏" />
            </Form.Item>

            <Form.Item name="perPage" label="每页文章数">
              <InputNumber min={5} max={100} />
            </Form.Item>

            <Form.Item name="allowComment" label="允许评论" valuePropName="checked">
              <Switch />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={updateSiteSettingsLoading}>
                保存设置
              </Button>
            </Form.Item>
          </Form>
        </Spin>
      ),
    },
    {
      key: 'blogger',
      label: '博主信息',
      icon: <UserOutlined />,
      children: (
        <Spin spinning={loading}>
          <Form
            form={bloggerForm}
            layout="vertical"
            onFinish={handleBloggerInfoSubmit}
          >
            <Form.Item label="头像">
              <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                <Avatar
                  size={64}
                  src={bloggerForm.getFieldValue('avatar')}
                  icon={<UserOutlined />}
                />
                <Upload beforeUpload={handleAvatarUpload} showUploadList={false}>
                  <Button icon={<UploadOutlined />}>上传头像</Button>
                </Upload>
              </div>
              <Form.Item name="avatar" noStyle>
                <Input type="hidden" />
              </Form.Item>
            </Form.Item>

            <Form.Item name="nickname" label="昵称" rules={[{ required: true, message: '请输入昵称' }]}>
              <Input placeholder="请输入昵称" />
            </Form.Item>

            <Form.Item name="bio" label="个人简介">
              <TextArea rows={3} placeholder="请输入个人简介" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={updateBloggerInfoLoading}>
                保存信息
              </Button>
            </Form.Item>
          </Form>
        </Spin>
      ),
    },
    {
      key: 'password',
      label: '修改密码',
      icon: <LockOutlined />,
      children: (
        <Form
          form={passwordForm}
          layout="vertical"
          onFinish={handlePasswordSubmit}
        >
          <Form.Item
            name="oldPassword"
            label="旧密码"
            rules={[{ required: true, message: '请输入旧密码' }]}
          >
            <Input.Password placeholder="请输入旧密码" />
          </Form.Item>

          <Form.Item
            name="newPassword"
            label="新密码"
            rules={[
              { required: true, message: '请输入新密码' },
              { min: 6, message: '密码至少6位' },
            ]}
          >
            <Input.Password placeholder="请输入新密码" />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="确认密码"
            dependencies={['newPassword']}
            rules={[
              { required: true, message: '请确认密码' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('两次密码不一致'));
                },
              }),
            ]}
          >
            <Input.Password placeholder="请确认新密码" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={updatePasswordLoading}>
              修改密码
            </Button>
          </Form.Item>
        </Form>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Title level={3}>系统设置</Title>

      <Card>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
        />
      </Card>
    </div>
  );
}