export function getAdminCHS(admin) {
    switch(admin) {
        case 1:
            return '超级管理员'
        case 2:
            return '管理员'
        default:
            return '非管理员'
    }
}

export function getStatusCHS(status) {
    switch(status) {
        case 0:
            return '冻结'
        case 1:
            return '正常'
        default:
            return '未知'
    }
}

export function getSexCHS(sex) {
    switch(sex) {
        case 0:
            return '女'
        case 1:
            return '男'
        default:
            return '未知'
    }
}

export function getEduCHS(sex) {
    switch(sex) {
        case 0:
            return '未设置'
        case 1:
            return '本科'
        case 2:
            return '硕士'
        case 3:
            return '博士'
        case 4:
            return '博士后'
        default:
            return '未知'
    }
}