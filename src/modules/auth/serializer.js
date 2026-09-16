const sanitizeUser = (user) => {
    if (!user) return;
    
    const { id, fullName, email, phone, address, role, createdAt, updatedAt } = user;
    return { id, fullName, email, phone, address, role, createdAt, updatedAt };
};

export { sanitizeUser };