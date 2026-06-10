// src/pages/blog/about.tsx

export function BlogAboutPage() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">关于博客</h2>
      <div className="prose prose-gray max-w-none">
        <p className="text-gray-700 leading-relaxed">
          这是一个基于现代 Web 技术栈构建的个人博客系统，旨在分享技术文章、生活感悟和学习心得。
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">技术栈</h3>
        <ul className="list-disc list-inside text-gray-600 space-y-1">
          <li>前端：React 18 + TypeScript + Vite</li>
          <li>后端：NestJS + TypeORM + PostgreSQL</li>
          <li>样式：TailwindCSS + Ant Design</li>
          <li>状态管理：Apollo Client + React Query</li>
        </ul>
        <h3 className="text-xl font-semibold mt-6 mb-3">联系方式</h3>
        <p className="text-gray-600">
          如果您有任何问题或建议，欢迎通过邮件联系我：contact@example.com
        </p>
      </div>
    </div>
  );
}