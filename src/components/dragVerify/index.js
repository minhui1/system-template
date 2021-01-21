import React, { useState } from 'react'
import './dragVerify.styl'

function DragVerify(props) {    
    const width = props.width || '100%'
    const height = props.height || '50px'
    const background = props.background || '#ccc'
    const border = props.border || 'none'
    const borderRadius = props.borderRadius || 0
    const handlerBg = props.handlerBg || '#fff'
    const completedBg = props.completedBg || '#67C23A'
    const progressBg = props.progressBg || '#ffff99'
    const finishPercent = props.finishPercent || 95
    const text = props.text || '向右滑动解锁'
    const textColor = props.textColor || '#333'
    const successText = props.text || 'success'
    const successTextColor = props.successTextColor || '#fff'
    const { isCircle, onFinished } = props

    const [moving, setMoving] = useState(false)
    const [startX, setStartX] = useState(0)
    const [dragLeft, setDragLeft] = useState(0)
    const [totalWidth, setTotalWidth] = useState(0)
    const [finishWidth, setFinishWidth] = useState(0)
    const [finished, setFinished] = useState(false)

    let moduleStyle = {
        width,
        height,
        background,
        border,
        borderRadius
    }

    const dragBlockStyle = {
        width: height,
        lineHeight: parseInt(height) + 'px',
        background: handlerBg,
    }

    if (isCircle) {
        moduleStyle.borderRadius = parseInt(height) / 2 + 'px'
        dragBlockStyle.borderRadius = '50%'
    }

    let refModule = null
    let refDrag = null
    let refProcess = null

    const handleMouseDown = (e) => {
        if (finished) {
            return
        }
        setMoving(true)
        setStartX(e.pageX)
        setDragLeft(parseInt(refDrag.style.left) || 0)
        const _totalWidth = parseInt(getComputedStyle(refModule).width) - height
        setTotalWidth(_totalWidth)
        setFinishWidth(parseInt((_totalWidth * finishPercent) / 100))
    }

    const handleMouseUp = (e) => {
        if (finished) {
            return
        }
        setMoving(false)
        reset()
    }

    const handleMouseLeave = (e) => {
        if (finished) {
            return
        }
        setMoving(false)
        reset()
    }

    const handleMouseMove = (e) => {
        if (!moving || finished) {
            return
        }
        let newLeft = parseInt(e.pageX - startX) + dragLeft
        if (newLeft < 0) {
            newLeft = 0
        } else if (newLeft > finishWidth) {
            newLeft = totalWidth
            done()
        }
        refDrag.style.left = newLeft + 'px'
        refProcess.style.width = parseInt(newLeft + height / 2) + 'px'
    }

    const reset = () => {
        refDrag.style.left = 0
        refProcess.style.width = 0
    }

    const done = () => {
        setFinished(true)
        refProcess.style.background = completedBg
        onFinished && onFinished()
    }

    return (
        <div
            className="M-dragVerify"
            style={moduleStyle}
            ref={(node) => {
                refModule = node
            }}
        >
            <div
                className="dragVerify-wrapper"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
            >
                <div
                    className="process-bar"
                    style={{ background: progressBg }}
                    ref={(node) => {
                        refProcess = node
                    }}
                ></div>
                {
                    finished ? 
                    <div className="show-text" style={{color: successTextColor, lineHeight: parseInt(height) + 'px'}}>{successText}</div> :
                    <div className="show-text" style={{color: textColor, lineHeight: parseInt(height) + 'px'}}>{text}</div>
                }
                <div
                    className="drag-block"
                    ref={(node) => {
                        refDrag = node
                    }}
                    style={dragBlockStyle}
                    onMouseUp={handleMouseUp}
                    onMouseDown={handleMouseDown}
                >
                    <i className="dragVerifyFont ficon-double-right"></i>
                </div>
            </div>
        </div>
    )
}

export default DragVerify
