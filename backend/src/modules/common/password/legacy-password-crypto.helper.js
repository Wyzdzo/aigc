// src/modules/common/password/legacy-password-crypto.helper.ts
import { pbkdf2Sync, timingSafeEqual } from 'crypto';
// import * as CryptoJS from 'crypto-js';
/**
 * 老系统兼容密码加密工具类
 * 提供与老系统兼容的 PBKDF2 密码哈希功能
 */
export class LegacyPasswordCryptoHelper {
    /**
     * 根据传入的密码和盐值生成哈希字符串（Node.js crypto 版本）
     * 使用 Node.js 内置 crypto 模块实现相同的算法
     * @param password - 用户的密码
     * @param salt - 用于加密的盐值
     * @returns 返回加密后的哈希字符串
     */
    static hashPasswordWithCrypto(password, salt) {
        // 5000 次迭代，64 字节输出长度，SHA-256 算法
        const hash = pbkdf2Sync(password, salt, 5000, 64, 'sha256').toString('hex');
        return hash;
    }
    /**
     * 验证密码是否正确（使用 Node.js crypto 版本）
     * 使用常量时间比较避免计时侧信道攻击
     * @param password - 待验证的密码
     * @param salt - 盐值
     * @param hashedPassword - 已存储的哈希密码
     * @returns 密码是否匹配
     */
    static verifyPasswordWithCrypto(password, salt, hashedPassword) {
        const hash = this.hashPasswordWithCrypto(password, salt);
        return timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(hashedPassword, 'hex'));
    }
}
