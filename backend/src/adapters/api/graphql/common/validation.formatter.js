export function formatValidationErrors(errors) {
    const messages = [];
    errors.forEach((error) => {
        if (error.constraints) {
            Object.values(error.constraints).forEach((message) => {
                messages.push(message);
            });
        }
        if (error.children && error.children.length > 0) {
            const childMessages = formatValidationErrors(error.children);
            messages.push(childMessages);
        }
    });
    return messages.join('; ');
}
