// RemoveBGNode component
// Dependencies (React, Handle, Position) are provided by the plugin system

function RemoveBGNode({ data }) {
  return React.createElement(
    'div',
    {
      className: 'px-4 py-3 bg-gradient-node rounded-lg shadow-node relative group',
      style: {
        minWidth: '240px',
        minHeight: '120px'
      }
    },
    
    // 输入端口 - 使用容器定位
    React.createElement(
      'div',
      {
        className: 'absolute left-0',
        style: { top: '60px' }
      },
      React.createElement(Handle, {
        type: 'target',
        position: Position.Left,
        id: 'image_base64',
        className: '!border-2',
        style: { 
          backgroundColor: 'hsl(212 100% 55%)',
          borderColor: 'hsl(212 100% 55%)'
        }
      }),
      // 端口标签
      React.createElement(
        'span',
        {
          className: 'text-xs text-muted-foreground ml-4 whitespace-nowrap',
          style: { 
            position: 'absolute', 
            left: '-50%',
            top: '50%', 
            transform: 'translateY(-80%)' 
          }
        },
        'image_base64'
      )
    ),
    
    // 节点标题区域
    React.createElement(
      'div',
      {
        className: 'flex items-center gap-2 mb-3'
      },
      React.createElement(
        'div',
        {
          className: 'w-5 h-5 bg-purple-500 rounded flex items-center justify-center text-white text-xs'
        },
        '🧼'
      ),
      React.createElement(
        'span',
        {
          className: 'font-medium text-sm text-foreground'
        },
        data.label || 'Remove Background'
      )
    ),
    
    // 输出端口 - 使用容器定位
    React.createElement(
      'div',
      {
        className: 'absolute right-0',
        style: { top: '60px' }
      },
      React.createElement(Handle, {
        type: 'source',
        position: Position.Right,
        id: 'image_base64',
        className: '!border-2',
        style: { 
          backgroundColor: 'hsl(212 100% 55%)',
          borderColor: 'hsl(212 100% 55%)'
        }
      }),
      // 端口标签
      React.createElement(
        'span',
        {
          className: 'text-xs text-muted-foreground mr-4 whitespace-nowrap',
          style: { 
            position: 'absolute', 
            right: '-50%', 
            top: '50%', 
            transform: 'translateY(-80%)' 
          }
        },
        'image_base64'
      )
    )
  );
}

// 确保默认导出，供打包器正确产出可用组件
export default RemoveBGNode;