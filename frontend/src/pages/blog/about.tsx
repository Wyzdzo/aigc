// src/pages/blog/about.tsx

import { GithubOutlined, MailOutlined, TwitterOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Card, Col, Row, Space, Tag, Typography } from 'antd';

const { Title, Paragraph } = Typography;

/**
 * 关于我页面
 */
export function BlogAboutPage() {
  const skills = [
    { name: 'React', level: 'expert', color: '#61DAFB' },
    { name: 'TypeScript', level: 'expert', color: '#3178C6' },
    { name: 'Node.js', level: 'expert', color: '#339933' },
    { name: 'NestJS', level: 'advanced', color: '#E0234E' },
    { name: 'GraphQL', level: 'advanced', color: '#E10098' },
    { name: 'PostgreSQL', level: 'advanced', color: '#4169E1' },
    { name: 'Docker', level: 'intermediate', color: '#2496ED' },
    { name: 'AWS', level: 'intermediate', color: '#FF9900' },
  ];

  const socialLinks = [
    { icon: <GithubOutlined />, label: 'GitHub', url: 'https://github.com', color: '#181717' },
    { icon: <TwitterOutlined />, label: 'Twitter', url: 'https://twitter.com', color: '#1DA1F2' },
    { icon: <MailOutlined />, label: 'Email', url: 'mailto:contact@example.com', color: '#EA4335' },
  ];

  const experiences = [
    { year: '2023 - 至今', title: '高级全栈工程师', company: '某科技公司' },
    { year: '2021 - 2023', title: '前端技术负责人', company: '某互联网公司' },
    { year: '2019 - 2021', title: '前端工程师', company: '某创业公司' },
  ];

  const achievements = [
    '开源项目 Star 数累计超过 5000',
    '技术博客阅读量超过 100 万',
    '多次受邀技术分享嘉宾',
    '团队技术负责人，管理 10+ 人团队',
  ];

  return (
    <div style={{ padding: 24 }}>
      <Row gutter={24}>
        {/* 左侧：博主信息 */}
        <Col xs={24} lg={8}>
          <Card style={{ borderRadius: 8 }}>
            <div style={{ textAlign: 'center' }}>
              <Avatar
                size={120}
                icon={<UserOutlined />}
                style={{
                  marginBottom: 16,
                  backgroundColor: '#1890ff',
                }}
              />
              <Title level={3} style={{ marginBottom: 8 }}>AIGC Blog</Title>
              <Paragraph type="secondary" style={{ marginBottom: 16 }}>
                全栈开发者 / 技术博主 / 开源爱好者
              </Paragraph>

              {/* 社交链接 */}
              <Space size="middle">
                {socialLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: link.color,
                      fontSize: 20,
                      transition: 'transform 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                    aria-label={`访问${link.label}`}
                  >
                    {link.icon}
                  </a>
                ))}
              </Space>
            </div>
          </Card>

          {/* 工作经历 */}
          <Card title="工作经历" style={{ borderRadius: 8, marginTop: 24 }}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              {experiences.map((exp) => (
                <div key={exp.year}>
                  <Paragraph strong style={{ marginBottom: 4 }}>
                    {exp.year}
                  </Paragraph>
                  <Paragraph style={{ marginBottom: 4 }}>{exp.title}</Paragraph>
                  <Paragraph type="secondary" style={{ marginBottom: 0 }}>
                    {exp.company}
                  </Paragraph>
                </div>
              ))}
            </Space>
          </Card>
        </Col>

        {/* 右侧：详细介绍 */}
        <Col xs={24} lg={16}>
          <Card style={{ borderRadius: 8 }}>
            <Title level={2} style={{ marginBottom: 16 }}>关于我</Title>
            <Paragraph style={{ fontSize: 16, lineHeight: 1.8 }}>
              大家好，我是一名热爱技术的全栈开发者。自 2019 年入行以来，我一直专注于 Web 开发领域，
              致力于打造高质量的软件产品。
            </Paragraph>
            <Paragraph style={{ fontSize: 16, lineHeight: 1.8 }}>
              在前端领域，我精通 React、TypeScript、Vue 等主流框架，熟悉各种状态管理方案和构建工具。
              在后端，我擅长使用 Node.js 和 NestJS 构建高性能的 API 服务，对数据库设计和优化也有深入研究。
            </Paragraph>
            <Paragraph style={{ fontSize: 16, lineHeight: 1.8 }}>
              除了日常工作，我还热衷于开源社区，参与了多个知名项目的开发和维护。
              同时，我也喜欢在博客上分享技术心得和最佳实践，希望能帮助更多开发者成长。
            </Paragraph>
          </Card>

          {/* 技能标签 */}
          <Card title="技能栈" style={{ borderRadius: 8, marginTop: 24 }}>
            <Space wrap size={12}>
              {skills.map((skill) => (
                <Tag
                  key={skill.name}
                  color={skill.color}
                  style={{
                    fontSize: 14,
                    padding: '6px 12px',
                    borderRadius: 4,
                  }}
                >
                  {skill.name}
                  <span style={{ marginLeft: 8, opacity: 0.7 }}>
                    {skill.level === 'expert' && '精通'}
                    {skill.level === 'advanced' && '熟练'}
                    {skill.level === 'intermediate' && '掌握'}
                  </span>
                </Tag>
              ))}
            </Space>
          </Card>

          {/* 成就 */}
          <Card title="成就" style={{ borderRadius: 8, marginTop: 24 }}>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {achievements.map((item, index) => (
                <li key={index} style={{ padding: '12px 0', borderBottom: '1px solid #f0f0f0' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        backgroundColor: '#1890ff',
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 12,
                        marginRight: 12,
                      }}
                    >
                      {index + 1}
                    </div>
                    <Paragraph style={{ marginBottom: 0 }}>{item}</Paragraph>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </Col>
      </Row>
    </div>
  );
}