var ChatConfig = { db_url: '' };
var SetChatConfig = (config) => {
  ChatConfig.db_url = config.db_url ? config.db_url : '';
}
var Config = {
  ChatConfig,
  SetChatConfig
};

export default Config; 