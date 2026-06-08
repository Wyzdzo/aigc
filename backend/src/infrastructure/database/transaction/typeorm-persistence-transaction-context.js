const typeOrmEntityManagers = new WeakMap();
export function createTypeOrmPersistenceTransactionContext(manager) {
    const transactionContext = Object.freeze({});
    typeOrmEntityManagers.set(transactionContext, manager);
    return transactionContext;
}
export function getTypeOrmEntityManager(transactionContext) {
    const manager = typeOrmEntityManagers.get(transactionContext);
    if (!manager) {
        throw new Error('Invalid TypeORM persistence transaction context');
    }
    return manager;
}
