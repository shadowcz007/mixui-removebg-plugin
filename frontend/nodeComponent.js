// RemoveBGNode component
// Dependencies (React, Handle, Position, PluginNodeWrapper) are provided by the plugin system

function RemoveBGNode({ data }) {
  // 插件只需要关注业务逻辑，UI布局由 PluginNodeWrapper 自动处理
  return React.createElement(
    'div',
    {
      className: 'text-center text-sm text-muted-foreground mt-2'
    },
    '由shadow制作的插件示例'
  );
}

// 确保默认导出，供打包器正确产出可用组件
export default RemoveBGNode;