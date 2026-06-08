var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
// src/modules/common/email-worker/email-delivery.service.ts
import { Injectable } from '@nestjs/common';
import { spawn } from 'node:child_process';
import { randomUUID } from 'node:crypto';
let EmailDeliveryService = (() => {
    let _classDecorators = [Injectable()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var EmailDeliveryService = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            EmailDeliveryService = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        logger;
        options;
        constructor(logger, options) {
            this.logger = logger;
            this.options = options;
            this.logger.setContext(EmailDeliveryService.name);
        }
        /**
         * 发送邮件，使用本机 sendmail 交给 Postfix 转发。
         */
        async send(input) {
            const providerMessageId = `sendmail-${randomUUID()}`;
            const body = input.html ?? input.text ?? '';
            const contentType = input.html ? 'text/html; charset="UTF-8"' : 'text/plain; charset="UTF-8"';
            const runAsUser = this.options.runAsUser;
            const deliveryMode = 'sendmail';
            const sendmailPath = this.options.sendmailPath;
            this.logger.info({
                deliveryMode,
                runAsUser: runAsUser?.trim() || undefined,
                sendmailPath,
            }, 'Email delivery command resolved');
            const headers = [`To: ${input.to}`, `Subject: ${input.subject}`, 'MIME-Version: 1.0'];
            headers.push(`Content-Type: ${contentType}`);
            const message = `${headers.join('\n')}\n\n${body}\n`;
            await this.sendWithSendmail({
                message,
                to: input.to,
                subject: input.subject,
                sendmailPath,
                runAsUser,
            });
            this.logger.info({
                to: this.maskEmail(input.to),
                subject: input.subject,
                providerMessageId,
                templateId: input.templateId,
            }, 'Email sent via sendmail');
            return {
                accepted: true,
                providerMessageId,
            };
        }
        /**
         * 通过 sendmail 执行发送，错误会抛出给上层处理。
         */
        async sendWithSendmail(input) {
            await new Promise((resolve, reject) => {
                const runAsUserValue = input.runAsUser?.trim() ?? '';
                const shouldRunAsUser = runAsUserValue.length > 0;
                const command = shouldRunAsUser ? 'sudo' : input.sendmailPath;
                const args = shouldRunAsUser
                    ? ['-n', '-u', runAsUserValue, input.sendmailPath, '-t', '-i']
                    : ['-t', '-i'];
                const child = spawn(command, args, { stdio: ['pipe', 'pipe', 'pipe'] });
                let stderr = '';
                let stdout = '';
                const commandLine = [command, ...args].join(' ');
                child.stdout.on('data', (chunk) => {
                    stdout += chunk.toString();
                });
                child.stderr.on('data', (chunk) => {
                    stderr += chunk.toString();
                });
                child.on('error', (error) => {
                    reject(error);
                });
                child.on('close', (code) => {
                    if (code === 0) {
                        resolve();
                        return;
                    }
                    reject(new Error(`Sendmail failed (code ${code}) cmd="${commandLine}" for ${input.to} subject "${input.subject}"; stdout="${stdout.slice(0, 256)}"; stderr="${stderr.slice(0, 512)}"`));
                });
                child.stdin.write(input.message);
                child.stdin.end();
            });
        }
        /**
         * 邮箱脱敏，避免日志泄露。
         */
        maskEmail(email) {
            const parts = email.split('@');
            if (parts.length !== 2)
                return '***';
            const [localPart, domainPart] = parts;
            if (localPart.length <= 2) {
                return `${localPart.charAt(0) || '*'}***@${domainPart}`;
            }
            return `${localPart.slice(0, 2)}***@${domainPart}`;
        }
    };
    return EmailDeliveryService = _classThis;
})();
export { EmailDeliveryService };
