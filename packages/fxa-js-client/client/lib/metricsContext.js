'use strict';

module.exports = {
  marshall: function(data) {
    return {
      deviceId: data.deviceId,
      entrypoint: data.entrypoint,
      entrypointExperiment: data.entrypointExperiment,
      entrypointVariation: data.entrypointVariation,
      flowId: data.flowId,
      flowBeginTime: data.flowBeginTime,
      utmCampaign: data.utmCampaign,
      utmContent: data.utmContent,
      utmMedium: data.utmMedium,
      utmSource: data.utmSource,
      utmTerm: data.utmTerm,
    };
  },
};
