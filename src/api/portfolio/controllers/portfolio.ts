import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::portfolio.portfolio', ({ strapi }) => ({
  async find(ctx) {
    const response = await super.find(ctx);

    if (Array.isArray(response.data)) {
      response.data = response.data.map(entry => {
        const attributes = entry?.attributes ?? {};
        return {
          ...entry,
          attributes: {
            ...attributes,
            content: String(attributes.content ?? ''),
            opis: String(attributes.opis ?? ''),
          },
        };
      });
    }

    return response;
  },

  async findOne(ctx) {
    const response = await super.findOne(ctx);

    if (response?.data?.attributes) {
      response.data.attributes.content = String(response.data.attributes.content ?? '');
      response.data.attributes.opis = String(response.data.attributes.opis ?? '');
    }

    return response;
  },
}));