import { createParamDecorator } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
/**
 * 获取当前用户信息的参数装饰器
 * 从 GraphQL 上下文中提取 JWT 用户信息
 */
export const currentUser = createParamDecorator((_data, context) => {
    const gqlCtx = GqlExecutionContext.create(context);
    const graphqlContext = gqlCtx.getContext();
    return graphqlContext.req.user;
});
