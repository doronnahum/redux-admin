export let _onReplaceParams;
export let _onSetParams;
export let _onBack;
export let _goHome;
export let _onGetParams;

export const setRouteConfig = function ({ onReplaceParams, onSetParams, onBack, goHome, onGetParams }) {
  if (onReplaceParams) { _onReplaceParams = onReplaceParams; }
  if (onSetParams) { _onSetParams = onSetParams; }
  if (onBack) { _onBack = onBack; }
  if (goHome) { _goHome = goHome; }
  if (onGetParams) { _onGetParams = onGetParams; }
};

const router = {
  onReplaceParams: (res) => _onReplaceParams(res),
  onSetParams: (res) => _onSetParams(res),
  onBack: (res) => _onBack(res),
  goHome: (res) => _goHome(res),
  onGetParams: (res) => _onGetParams(res),
};
export default router;
