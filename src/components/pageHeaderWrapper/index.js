import React from 'react'
import { PageHeader } from 'antd'
import './pageHeaderWrapper.styl'

function PageHeaderWrapper(props) {

    return (
        <PageHeader {...props} className="M-pageHeaderWrapper" />
    )

}

export default PageHeaderWrapper