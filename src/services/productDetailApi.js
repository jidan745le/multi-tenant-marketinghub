
const PIM_GRAPHQL_URL = 'https://pim-test.kendo.com/pimcore-graphql-webservices/products';
const API_KEY = '4fe5b9cb2dc6015250c46f9332c195ae';
class ProductDetailApiService {
  constructor() {
    this.baseURL = PIM_GRAPHQL_URL;
  }

  // 获取请求头
  getHeaders() {
    return {
      'Content-Type': 'application/json',
      'X-API-Key': API_KEY,
    };
  }

  // 处理API响应
  async handleResponse(response) {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  // 完整的GraphQL查询语句
  getProductQuery = `
    query getProduct($id: Int!) {
      getProduct(id: $id) {
        id
        VirtualProductID
        ProductName_en: ProductName(language: "en")
        ProductName_de: ProductName(language: "de")
        ShortDescription_en: ShortDescription(language: "en")
        LongDescription_en: LongDescription(language: "en")
        CategoryName
        
        # BASIC CARD INFO
        ProductLabel
        LifecycleStatus
        OnlineDate
        EnrichmentStatus
        creationDate
        Main {
          id
          filename
          fullpath
          assetThumb2: fullpath(thumbnail: "content", format: "webp")

        }
        
        # BASIC DATA
        Brand
        ProductType
        VirtualProductID
        version
        CustomerFacingProductCode
        Sellable
        classname
        CountryOfOrigin
        Warranty
        modificationDate
        FirstShipmentDate
        
        # SAP DETAIL
        BasicUnitOfMeasurement
        ProductDimensions
        ConsolidationSKUNumbers
        FactoryInstructionCN
        SAPShortDescriptionEN
        
        # MARKETING COPY
        ProductName
        CategoryID
        ShortDescription
        LongDescription
        PackagingContains
        
        # ICONS
        Icons {
          crop {
            cropWidth
          }
          image {
            filename
            fullpath
            filesize
            assetThumb2: fullpath(thumbnail: "content", format: "webp")
            metadata {
              data
              name
              type
              language
            }
          }
        }
        
        # QR CODES
        WebsiteLinkDE
        
        # EANS
        SingleProductEAN
        InnerBoxEANCode
        MasterCartonEANCode
        
        # PACKAGING DATA
        InnerBoxQuantity
        UnitPackingMC
        INSizeWxHxL
        InnerBoxGrossWeight
        InnerBoxSizeLcm
        InnerBoxSizeWcm
        InnerBoxSizeHcm
        InnerBoxVolumeM3
        MCQuantity
        MeasurementUnitMC
        MCSizeWxHxL
        MCNetWeight
        MCGrossWeight
        MCSizeLcm
        MCSizeWcm
        MCSizeHcm
        MCVolumeM3
        SAPPackagingType
        UnitPackingItem
        PCSInUnitPackingItem
        MeasurementUnitItem
        ItemSizeWxHxL
        ItemNetWeight
        ItemGrossWeight
        ItemSizeLcm
        ItemSizeWcm
        ItemSizeHcm
        ItemVolumeM3
        
        # SPECS
        Specs {
          __typename
          description
          id
          name
          ... on csGroup {
            description
            id
            name
            features {
              __typename
              ... on csFeatureInput {
                description
                id
                name
                text
              }
              ... on csFeatureSelect {
                description
                id
                name
                selection
              }
              ... on csFeatureNumeric {
                description
                id
                name
                number
                title
              }
              ... on csFeatureQuantityValue {
                description
                name
                type
                quantityvalue {
                  unit {
                    id
                    longname
                    abbreviation
                  }
                  value
                }
              }
              ... on csFeatureBooleanSelect {
                description
                id
                name
                title
                checked
              }
            }
          }
        }
        
        # LOGO MARKING
        AdditionalPrinting
        Logo1
        Logo2
        
        # BUNDLES & RELATIONSHIPS
        Bundle {
          __typename
          ... on object_Product {
            ProductName
            id
            VirtualProductID
            Main {
              id
              filename
              fullpath
              assetThumb2: fullpath(thumbnail: "content", format: "webp")
            }
          }
        }
        
        Components {
          element {
            ... on object_Product {
              ProductName
              id
              VirtualProductID
              Main {
                id
                filename
                fullpath
                assetThumb2: fullpath(thumbnail: "content", format: "webp")
              }
            }
          }
        }
        
        Accessories {
          element {
            ... on object_Product {
              ProductName
              id
              VirtualProductID
              Main {
                id
                filename
                fullpath
                assetThumb2: fullpath(thumbnail: "content", format: "webp")
              }
            }
          }
        }
        
        # MARKETING COLLATERALS
        OnWhite {
          image {
            filename
            fullpath
            id
            filesize
            assetThumb2: fullpath(thumbnail: "content", format: "webp")
            metadata {
              data
              name
              type
              language
            }
          }
        }
        
        Lifestyles {
          image {
            filename
            fullpath
            id
            filesize
            assetThumb2: fullpath(thumbnail: "content", format: "webp")
            metadata {
              data
              name
              type
              language
            }
          }
        }
        
        ProductVideos {
          ... on asset {
            filename
            fullpath
            id
            filesize
            assetThumb2: fullpath(thumbnail: "content", format: "webp")
            metadata {
              data
              name
              type
              language
            }
          }
        }
        
        CategoryVideos {
          ... on asset {
            filename
            fullpath
            id
            filesize
            assetThumb2: fullpath(thumbnail: "content", format: "webp")
            metadata {
              data
              name
              type
              language
            }
          }
        }
        
        # AFTER SERVICE
        Manuals {
          __typename
          ... on asset {
            filename
            fullpath
            id
            filesize
            assetThumb2: fullpath(thumbnail: "content", format: "webp")
            metadata {
              data
              name
              type
              language
            }
          }
        }
        
        RepairGuides {
          __typename
          ... on asset {
            filename
            fullpath
            id
            filesize
            assetThumb2: fullpath(thumbnail: "content", format: "webp")
            metadata {
              data
              name
              type
              language
            }
          }
        }
        
        PackingGuideline {
          __typename
          ... on asset {
            filename
            fullpath
            id
            filesize
            assetThumb2: fullpath(thumbnail: "content", format: "webp")
            metadata {
              data
              name
              type
              language
            }
          }
        }
        
        ProductDrawing {
          __typename
          ... on asset {
            filename
            fullpath
            id
            filesize
            assetThumb2: fullpath(thumbnail: "content", format: "webp")
            metadata {
              data
              name
              type
              language
            }
          }
        }
        
        ProductPatent {
          __typename
          ... on asset {
            filename
            fullpath
            id
            filesize
            assetThumb2: fullpath(thumbnail: "content", format: "webp")
            metadata {
              data
              name
              type
              language
            }
          }
        }

        parent {
          __typename
          ... on object_Product {
            children {
            __typename
            ...on object_Product {
              id
              Size
              MainMaterial
              SurfaceFinish
              ApplicableStandard              
          }
        }
      }
    }
      }
    }
  `;

  // 主要数据转换函数
  transformProductData(rawData) {
    const product = rawData.data?.getProduct;
    if (!product) {
      throw new Error('Product not found');
    }

    return {
      productCardInfo: this.transformProductCardInfo(product),
      basicData: this.transformBasicData(product),
      sapData: this.transformSapData(product),
      marketingData: this.transformMarketingData(product),
      referenceRelationship: this.transformReferenceRelationshipData(product),
      iconsPictures: this.transformIconsPicturesData(product),
      qrCodes: this.transformQrCodesData(product),
      eans: this.transformEansData(product),
      packagingData: this.transformPackagingData(product),
      packagingSpec: this.transformPackagingSpecData(product),
      marketingCollaterals: this.transformMarketingCollateralsData(product),
      afterService: this.transformAfterServiceData(product),
      skuData: this.transformSkuData(product)
    };
  }

  // 产品卡片信息转换
  transformProductCardInfo(product) {
    return {
      productNumber: product.VirtualProductID || product.CustomerFacingProductCode || product.id || '',
      productName: product.ProductName_en || product.ProductName || '',
      developmentStatus: this.getDevelopmentStatus(product.EnrichmentStatus, product.LifecycleStatus),
      lifeCycleStatus: product.LifecycleStatus || '',
      enrichmentStatus: product.EnrichmentStatus || '',
      regionalLaunchDate: this.formatDate(product.OnlineDate),
      finalReleaseDate: this.formatDate(product.FirstShipmentDate),
      imageUrl: product.Main?.fullpath || '',
      thumbnailUrl: product.Main?.assetThumb2 || ''
    };
  }

  // 基础数据转换
  transformBasicData(product) {
    return {
      brand: product.Brand || '',
      region: product.Region || '',
      productType: product.ProductType || '',
      modelNumber: product.VirtualProductID || product.id || '',
      version: product.version?.toString() || '',
      customerFacingModel: product.CustomerFacingProductCode || product.VirtualProductID || '',
      productSeries: product.CategoryName || '',
      sellable: Boolean(product.Sellable),
      recognition: null,
      productNumber: product.VirtualProductID || product.id || '',
      productClassification: product.classname || null,
      countryOfOrigin: product.CountryOfOrigin || '',
      warranty: product.Warranty || '',
      lastChangedOn: this.formatDate(product.modificationDate),
      lifeCycleStatus: product.LifecycleStatus || '',
      enrichmentStatus: product.EnrichmentStatus || '',
      firstShippingDate: this.formatDate(product.FirstShipmentDate),
      createdOn: this.formatDate(product.creationDate)
    };
  }

  // SAP数据转换
  transformSapData(product) {
    return {
      basicUnitOfMeasurement: product.BasicUnitOfMeasurement || '',
      productDimensions: product.ProductDimensions,
      consolidationSkuNumbers: product.ConsolidationSKUNumbers,
      factoryInstructionCn: product.FactoryInstructionCN || '',
      sapShortDescriptionEn: product.SAPShortDescriptionEN || ''
    };
  }

  // 营销数据转换
  transformMarketingData(product) {
    return {
      modelName: product.VirtualProductID || product.ProductName || '',
      categoryBullets: this.extractCategoryBullets(product),
      popShortDescription: product.ShortDescription_en || product.ShortDescription || '',
      longDescription: product.LongDescription_en || product.LongDescription || '',
      packagingContains: product.PackagingContains || '',
      specifications: this.extractSpecifications(product.Specs)
    };
  }

  // 关系数据转换
  transformReferenceRelationshipData(product) {
    return {
      bundles: this.transformBundles(product.Bundle),
      components: this.transformComponents(product.Components),
      accessories: this.transformAccessories(product.Accessories)
    };
  }

  // 图标和图片数据转换
  transformIconsPicturesData(product) {
    const icons = [];
    if (product.Icons && Array.isArray(product.Icons)) {
      product.Icons.forEach(icon => {
        if (icon.image) {
          icons.push({
            imageUrl: icon.image.fullpath || '',
            type: this.extractIconType(icon.image.metadata),
            thumbnailUrl: icon.image.assetThumb2 || ''
          });
        }
      });
    }
    return { icons };
  }

  // 二维码数据转换
  transformQrCodesData(product) {
    const qrCodes = [];
    if (product.WebsiteLinkDE) {
      qrCodes.push({
        name: 'Website Link',
        link: product.WebsiteLinkDE
      });
    }
    return { qrCodes };
  }

  // EAN数据转换
  transformEansData(product) {
    const eans = [];
    if (product.SingleProductEAN) {
      eans.push({
        name: 'Single Product EAN',
        eanCode: product.SingleProductEAN
      });
    }

    if (product.InnerBoxEANCode) {
      eans.push({
        name: 'Inner Box EAN',
        eanCode: product.InnerBoxEANCode
      });
    }
    if (product.MasterCartonEANCode) {
      eans.push({
        name: 'Master Carton EAN',
        eanCode: product.MasterCartonEANCode
      });
    }
    return { eans };
  }

  // 包装数据转换
  transformPackagingData(product) {
    const headers = ['DIMENSIONS', 'ITEM', 'INNER BOX', 'MASTER CARTON'];
    const rows = [
      [
        'Packaging Type',
        product.UnitPackingItem || '',
        '',
        product.UnitPackingMC || ''
      ],
      [
        'Quantity(pcs)',
        parseInt(product.PCSInUnitPackingItem) || 0,
        parseInt(product.InnerBoxQuantity) || 0,
        parseInt(product.MCQuantity) || 0
      ],
      [
        'Net Weight(kg)',
        parseFloat(product.ItemNetWeight) || 0,
        0, // Inner box net weight not provided in data
        parseFloat(product.MCNetWeight) || 0
      ],
      [
        'Gross Weight(kg)',
        parseFloat(product.ItemGrossWeight) || 0,
        parseFloat(product.InnerBoxGrossWeight) || 0,
        parseFloat(product.MCGrossWeight) || 0
      ],
      [
        'L×W×H(cm)',
        product.ItemSizeWxHxL || `${product.ItemSizeLcm}×${product.ItemSizeWcm}×${product.ItemSizeHcm}`,
        product.INSizeWxHxL || `${product.InnerBoxSizeLcm}×${product.InnerBoxSizeWcm}×${product.InnerBoxSizeHcm}`,
        product.MCSizeWxHxL || `${product.MCSizeLcm}×${product.MCSizeWcm}×${product.MCSizeHcm}`
      ],
      [
        'Volume(m³)',
        parseFloat(product.ItemVolumeM3) || 0,
        parseFloat(product.InnerBoxVolumeM3) || 0,
        parseFloat(product.MCVolumeM3) || 0
      ]
    ];

    return { headers, rows };
  }

  // 包装规格数据转换
  transformPackagingSpecData(product) {
    const technicalSpecs = [];
    const logoMarking = [];

    // 从Specs中提取技术规格
    if (product.Specs && Array.isArray(product.Specs)) {
      product.Specs.forEach(spec => {
        if (spec.__typename === 'csGroup' && spec.features) {
          spec.features.forEach(feature => {
            const specItem = this.transformSpecFeature(feature);
            if (specItem) {
              technicalSpecs.push(specItem);
            }
          });
        }
      });
    }

    // Logo标记信息

    logoMarking.push({
      featureName: 'Logo 1',
      value: product.Logo1,
    });


    logoMarking.push({
      featureName: 'Logo 2',
      value: product.Logo2
    });



    logoMarking.push({
      featureName: 'AdditionalPrinting',
      value: product.AdditionalPrinting
    });


    return { technicalSpecs, logoMarking };
  }

  // 营销宣传材料数据转换
  transformMarketingCollateralsData(product) {
    return {
      onWhite: this.transformImageCollection(product.OnWhite),
      actionLifestyle: this.transformImageCollection(product.Lifestyles),
      videos: this.transformVideoCollection([
        ...(product.ProductVideos || []),
        ...(product.CategoryVideos || [])
      ])
    };
  }

  // 售后服务数据转换
  transformAfterServiceData(product) {
    return {
      manuals: this.transformAfterServiceCollection(product.Manuals),
      repairGuide: this.transformAfterServiceCollection(product.RepairGuides),
      packaging: this.transformAfterServiceCollection(product.PackingGuideline),
      drawing: this.transformAfterServiceCollection(product.ProductDrawing),
      patent: this.transformAfterServiceCollection(product.ProductPatent)
    };
  }

  // 辅助函数
  formatDate(dateString) {
    if (!dateString) return '';
    try {
      return new Date(dateString).toISOString().split('T')[0];
    } catch {
      return '';
    }
  }

  getDevelopmentStatus(enrichmentStatus, lifecycleStatus) {
    if (lifecycleStatus === 'Active' && enrichmentStatus) {
      return 'READY FOR LAUNCH';
    }
    if (enrichmentStatus === 'Local Data Ready') {
      return 'IN DEVELOPMENT';
    }
    return enrichmentStatus || lifecycleStatus || '';
  }

  extractCategoryBullets(product) {
    const bullets = [];
    const items = [
      product.CategoryName,
      product.ProductLabel,
      product.ProductName_en,
      product.Brand && product.CategoryName ? `${product.Brand} ${product.CategoryName}` : null
    ];

    items.forEach(item => {
      if (item && !bullets.includes(item)) {
        bullets.push(item);
      }
    });

    return bullets;
  }

  extractSpecifications(specs) {
    if (!specs || !Array.isArray(specs)) return '';

    const specStrings = [];
    specs.forEach(spec => {
      if (spec.__typename === 'csGroup' && spec.features) {
        spec.features.forEach(feature => {
          const specText = this.getFeatureText(feature);
          if (specText) {
            specStrings.push(specText);
          }
        });
      }
    });

    return specStrings.join(', ');
  }

  getFeatureText(feature) {
    switch (feature.__typename) {
      case 'csFeatureInput':
        return feature.text ? `${feature.name}: ${feature.text}` : null;
      case 'csFeatureSelect':
        return feature.selection ? `${feature.name}: ${feature.selection}` : null;
      case 'csFeatureNumeric':
        return feature.number ? `${feature.name}: ${feature.number}` : null;
      case 'csFeatureQuantityValue':
        if (feature.quantityvalue && feature.quantityvalue.value) {
          const unit = feature.quantityvalue.unit?.abbreviation || '';
          return `${feature.name}: ${feature.quantityvalue.value}${unit}`;
        }
        return null;
      case 'csFeatureBooleanSelect':
        return feature.checked ? `${feature.name}: Yes` : null;
      default:
        return null;
    }
  }

  transformSpecFeature(feature) {
    const text = this.getFeatureText(feature);
    if (!text) return null;

    const [name, value] = text.split(': ');
    let unit = '';

    if (feature.__typename === 'csFeatureQuantityValue' && feature.quantityvalue?.unit) {
      unit = feature.quantityvalue.unit.abbreviation;
    }

    return {
      featureName: name,
      value: value,
      unit: unit
    };
  }

  transformBundles(bundles) {
    if (!bundles || !Array.isArray(bundles)) return [];

    return bundles.map(bundle => ({
      productNumber: bundle.VirtualProductID || bundle.id || '',
      productName: bundle.ProductName || '',
      imageUrl: bundle.Main?.fullpath || ''
    }));
  }

  transformComponents(components) {
    if (!components || !Array.isArray(components)) return [];

    return components.map(comp => ({
      productNumber: comp.element?.VirtualProductID || comp.element?.id || '',
      productName: comp.element?.ProductName || '',
      imageUrl: comp.element?.Main?.fullpath || ''
    }));
  }

  transformAccessories(accessories) {
    if (!accessories || !Array.isArray(accessories)) return [];

    return accessories.map(acc => ({
      imageUrl: acc.element?.Main?.fullpath || '',
      model: acc.element?.VirtualProductID || acc.element?.id || '',
      name: acc.element?.ProductName || '',
      quantity: parseInt(acc.element?.Quantity) || 0
    }));
  }

  extractIconType(metadata) {
    if (!metadata || !Array.isArray(metadata)) return 'icon';

    const typeMetadata = metadata.find(m => m.name === 'type');
    return typeMetadata?.data || '';
  }

  transformImageCollection(imageCollection) {
    if (!imageCollection || !Array.isArray(imageCollection)) return [];

    return imageCollection.map(item => {
      const image = item.image || item;
      return {
        imageUrl: image.fullpath || '',
        thumbnailUrl: image.assetThumb2 || '',
        downloadUrl: image.fullpath || '',
        fileName: image.filename || '',
        basicInfo: {
          modelNumber: this.extractMetadataValue(image.metadata, 'modelNumber'),
          imageType: this.extractMetadataValue(image.metadata, 'imageType'),
          lockDate: this.extractMetadataValue(image.metadata, 'lockDate'),
          countryRestrictions: this.extractMetadataValue(image.metadata, 'countryRestrictions'),
          usageRights: this.extractMetadataValue(image.metadata, 'usageRights'),
          approvalStatus: this.extractMetadataValue(image.metadata, 'approvalStatus')
        },
        technical: {
          colorSpace: this.extractMetadataValue(image.metadata, 'colorSpace'),
          colorProfile: this.extractMetadataValue(image.metadata, 'colorProfile'),
          resolution: this.extractMetadataValue(image.metadata, 'resolution'),
          dimensions: this.extractMetadataValue(image.metadata, 'dimensions'),
          size: this.formatFileSize(image.filesize),
          createdOn: this.extractMetadataValue(image.metadata, 'createdDate'),
          changeDate: this.extractMetadataValue(image.metadata, 'changeDate')
        }
      };
    });
  }

  transformVideoCollection(videos) {
    if (!videos || !Array.isArray(videos)) return [];

    return videos.map(video => ({
      thumbnailUrl: video.assetThumb2 || '',
      downloadUrl: video.fullpath || '',
      videoTitle: this.extractMetadataValue(video.metadata, 'title') || video.filename || '',
      language: this.extractMetadataValue(video.metadata, 'language') || '',
      type: this.extractMetadataValue(video.metadata, 'type') || '',
      format: 'Video',
      duration: this.extractMetadataValue(video.metadata, 'duration') || ''
    }));
  }

  transformAfterServiceCollection(collection) {
    if (!collection || !Array.isArray(collection)) return [];

    return collection.map(item => ({
      thumbnailUrl: item.assetThumb2 || '',
      downloadUrl: item.fullpath || '',
      fileName: item.filename || '',
      title: this.extractMetadataValue(item.metadata, 'title') || item.filename || ''
    }));
  }

  extractMetadataValue(metadata, key) {
    if (!metadata || !Array.isArray(metadata)) return '';
    const item = metadata.find(m => m.name === key);
    return item?.data || '';
  }

  formatFileSize(bytes) {
    if (!bytes) return '';
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  }

  // 获取产品详情
  async getProductDetail(id) {
    try {
      const response = await fetch(this.baseURL, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          query: this.getProductQuery,
          variables: { id: parseInt(id) }
        }),
      });

      const rawData = await this.handleResponse(response);

      // 检查GraphQL错误
      if (rawData.errors) {
        throw new Error(rawData.errors[0]?.message || 'GraphQL query failed');
      }
      console.log('transformProductData', this.transformProductData(rawData));

      return this.transformProductData(rawData);
    } catch (error) {
      console.error('Error fetching product detail:', error);
      throw error;
    }
  }

  // SKU数据转换
  transformSkuData(product) {
    // 从 parent.children 中获取 SKU 数据
    const children = product.parent?.children || [];

    return children.map(child => ({
      productNumber: child.id || '',
      size: child.Size || '',
      mainMaterial: child.MainMaterial || '',
      surfaceFinish: child.SurfaceFinish || '',
      applicableStandard: child.ApplicableStandard || ''
    }));
  }

  // 批量获取产品详情
  async getProductDetails(ids) {
    try {
      const promises = ids.map(id => this.getProductDetail(id));
      const results = await Promise.allSettled(promises);

      return results.map((result, index) => ({
        id: ids[index],
        success: result.status === 'fulfilled',
        data: result.status === 'fulfilled' ? result.value : null,
        error: result.status === 'rejected' ? result.reason.message : null
      }));
    } catch (error) {
      console.error('Error fetching product details:', error);
      throw error;
    }
  }
}

export default new ProductDetailApiService();

