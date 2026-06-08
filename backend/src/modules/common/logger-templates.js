import { buildFullRequest, buildMinimalRequest, buildRequestBody, } from '../../core/common/logger/templates';
/**
 * 常见日志格式模板（封装对框架类型的适配）
 */
export const logTemplates = {
    /**
     * 输出请求主体相关内容（泛型支持）
     * @param req Express Request 对象
     * @returns 包含 url / method / body 的日志数据
     */
    requestBody: (req) => buildRequestBody({ url: req.url, method: req.method, body: req.body }),
    /**
     * 精简请求信息
     * @param req Express Request 对象
     * @returns 仅包含 url / method 的日志数据
     */
    minimalRequest: (req) => buildMinimalRequest({ url: req.url, method: req.method }),
    /**
     * 带查询与参数的完整请求（泛型支持）
     * @param req Express Request 对象
     * @returns 包含 url / method / query / params / body 的日志数据
     */
    fullRequest: (req) => buildFullRequest({
        url: req.url,
        method: req.method,
        query: req.query,
        params: req.params,
        body: req.body,
    }),
};
/**
 * 输出 debug 日志（带上下文标记）
 * @param logger PinoLogger 实例
 * @param message 日志消息
 * @param payload 附加负载（可选）
 * @param context 日志上下文（可选），用于 setContext
 */
export function debugLog(logger, message, payload, context) {
    if (context)
        logger.setContext(context);
    logger.debug(payload ?? {}, message);
}
/**
 * 输出 error 日志（带上下文标记）
 * @param logger PinoLogger 实例
 * @param message 日志消息
 * @param payload 附加负载（可选）
 * @param context 日志上下文（可选），用于 setContext
 */
export function errorLog(logger, message, payload, context) {
    if (context)
        logger.setContext(context);
    logger.error(payload ?? {}, message);
}
/**
 * 带错误堆栈的 error 日志
 * @param logger PinoLogger 实例
 * @param message 日志消息
 * @param error 错误对象
 * @param payload 附加负载（可选）
 * @param context 日志上下文（可选），用于 setContext
 */
export function errorLogWithStack(logger, message, error, payload, context) {
    if (context)
        logger.setContext(context);
    logger.error({
        ...payload,
        error: {
            message: error.message,
            stack: error.stack,
            name: error.name,
        },
    }, message);
}
