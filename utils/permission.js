const permissions = {
    buyer: [
        'view_item',
        'view_all_items',
        'get_item',
    ],
    vendor: [
        'add_item',
        'update_item',
        'delete_item',
        'view_item',
        'view_all_items'
    ],
}

export const checkPermission = (role, action) => {
    if (role === 'buyer') {
        return permissions.buyer.includes(action);
    }
    else if (role === 'vendor') {
        return permissions.vendor.includes(action);
    }
}