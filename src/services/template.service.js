'use strict';

const TemplateModel = require('../models/template.model');
const { htmlEmailToken } = require('../utils/tem.html');

class TemplateService {

  static newTemplate = async ({
    tem_name,
    tem_id = 0,
    tem_html,
  }) => {
    // 1. check if template exists

    // 2. create a new template
    const newTem = await TemplateModel.create({
      tem_name,
      tem_id,
      tem_html: htmlEmailToken(),
    })

    return newTem;
  }

  static getTemplate = async ({
    tem_name
  }) => {
    const template = await TemplateModel.findOne({
      tem_name
    })

    return template;
  }
}

module.exports = TemplateService;
