import CookieService from '../utils/cookieService';

const PIM_GRAPHQL_URL = '/apis/kendo/products';
const API_KEY = '4fe5b9cb2dc6015250c46f9332c195ae';
class ProductDetailApiService {
  constructor() {
    this.baseURL = PIM_GRAPHQL_URL;
  }

  // 获取请求头
  getHeaders() {
    const token = CookieService.getToken();
    return {
      'Pragma': 'no-cache',
      'X-API-Key': API_KEY,
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
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

  // 构建filter字符串
  buildFilterString(filter) {
    return JSON.stringify(filter).replace(/"/g, '\\"');
  }

  // 动态构建GraphQL查询语句
  buildProductQuery(first, after, filter, defaultLanguage) {
    // 将filter对象转换为GraphQL语法
    const filterString = this.buildFilterString(filter);
    return `
    query getProductListing {
      getProductListing(first: ${first}, after: ${after}, filter: "${filterString}", defaultLanguage: "${defaultLanguage}") {
        edges {
          cursor
          node {
            id
            VirtualProductID
        
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
            ERPMaterialCode
            ABC
            PriceListUSD {
              unit {
                id
                longname
                abbreviation
              }
              value
            }
            ExportRestrictions
            InchMeasurementUnitMarkets
            
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
            BulletTextListView
            ChannelSpecificDescription
            PackagingContains
            Benefits
            
            # SEO
            SEOTitle
            SEOKeywords
            SEODescription
            
            # ICONS
            Icons {
              crop {
                cropWidth
              }
              image {
                id
                filename
                fullpath
                filesize
                assetThumb2: fullpath(thumbnail: "content", format: "webp")
                creationDate
                modificationDate
                dimensions {
                  width
                  height
                }
                metadata {
                  data
                  name
                  type
                  language
                }
              }
            }
            
            # QR CODES
            WebsiteLink_de_DE
            WebsiteLink_en_US
            
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
                    title
                  }
                  ... on csFeatureSelect {
                    description
                    id
                    name
                    selection
                    title
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
                    title
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

    # MarketingFeatures     
    MarketingFeatures {
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
            title
          }
          ... on csFeatureSelect {
            description
            id
            name
            selection
            title
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
            title
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
            CustomerFacingProductCode
            objectType
            Main {
              id
              filename
              fullpath
              assetThumb2: fullpath(thumbnail: "content", format: "webp")
            }
            children {
              ... on object_Product {
                CustomerFacingProductCode
              }
            }
          }
        }
        
        Components {
          element {
            ... on object_Product {
              ProductName
              id
              VirtualProductID
              CustomerFacingProductCode
              objectType
              Main {
                id
                filename
                fullpath
                assetThumb2: fullpath(thumbnail: "content", format: "webp")
              }
              children {
                ... on object_Product {
                  CustomerFacingProductCode
                }
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
              CustomerFacingProductCode
              objectType
              Main {
                id
                filename
                fullpath
                assetThumb2: fullpath(thumbnail: "content", format: "webp")
              }
              children {
                ... on object_Product {
                  CustomerFacingProductCode
                }
              }
            }
          }
        }

    Successor {
      ... on object_Product {
        ProductName
        CustomerFacingProductCode
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
        
        # MARKETING COLLATERALS
        OnWhite {
          image {
            filename
            fullpath
            id
            filesize
            assetThumb2: fullpath(thumbnail: "content", format: "webp")
            creationDate
            modificationDate
            dimensions {
              width
              height
            }
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
            creationDate
            modificationDate
            dimensions {
              width
              height
            }
            metadata {
              data
              name
              type
              language
            }
          }
        }
        
        ImageGallery {
          image {
            filename
            fullpath
            id
            filesize
            assetThumb2: fullpath(thumbnail: "content", format: "webp")
            creationDate
            modificationDate
            dimensions {
              width
              height
            }
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
            creationDate
            modificationDate
            dimensions {
              width
              height
            }
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
            creationDate
            modificationDate
            dimensions {
              width
              height
            }
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
            creationDate
            modificationDate
            dimensions {
              width
              height
            }
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
            creationDate
            modificationDate
            dimensions {
              width
              height
            }
            metadata {
              data
              name
              type
              language
            }
          }
        }
        
      #packaging
    InnerCartonArtwork{
      ... on asset {
        filename
        fullpath
        id
        filesize
        assetThumb2: fullpath(thumbnail: "content", format: "webp")
        creationDate
        modificationDate
        dimensions {
          width
          height
        }
        metadata {
          data
          name
          type
          language
        }
      }
    }
    
    MasterCartonArtwork{
      ... on asset {
        filename
        fullpath
        id
        filesize
        assetThumb2: fullpath(thumbnail: "content", format: "webp")
        creationDate
        modificationDate
        dimensions {
          width
          height
        }
        metadata {
          data
          name
          type
          language
        }
      }
    }

    PackingGuideline {
      ... on asset {
        filename
        fullpath
        id
        filesize
        assetThumb2: fullpath(thumbnail: "content", format: "webp")
        creationDate
        modificationDate
        dimensions {
          width
          height
        }
        metadata {
          data
          name
          type
          language
        }
      }
    }
    
    SalesPackagingArtwork {
      ... on asset {
        filename
        fullpath
        id
        filesize
        assetThumb2: fullpath(thumbnail: "content", format: "webp")
        creationDate
        modificationDate
        dimensions {
          width
          height
        }
        metadata {
          data
          name
          type
          language
        }
      }
    }
        
   #DRAWING
    MoldDrawing {
      ... on asset {
        filename
        fullpath
        id
        filesize
        assetThumb2: fullpath(thumbnail: "content", format: "webp")
        creationDate
        modificationDate
        dimensions {
          width
          height
        }
        metadata {
          data
          name
          type
          language
        }
      }
    }   
    
    ProductDrawing {
      ... on asset {
        filename
        fullpath
        id
        filesize
        assetThumb2: fullpath(thumbnail: "content", format: "webp")
        creationDate
        modificationDate
        dimensions {
          width
          height
        }
        metadata {
          data
          name
          type
          language
        }
      }
    }
    
    ProductLineDrawing {
      ... on asset {
        filename
        fullpath
        id
        filesize
        assetThumb2: fullpath(thumbnail: "content", format: "webp")
        creationDate
        modificationDate
        dimensions {
          width
          height
        }
        metadata {
          data
          name
          type
          language
        }
      }
    }
     
    #PATENT
        ProductPatent {
          __typename
          ... on asset {
            filename
            fullpath
            id
            filesize
            assetThumb2: fullpath(thumbnail: "content", format: "webp")
            creationDate
            modificationDate
            dimensions {
              width
              height
            }
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
                CustomerFacingProductCode
                Size
                MainMaterial
                SurfaceFinish
                UnitPackingItem
                InnerBoxQuantity
                MCQuantity
                ApplicableStandard              
              }
            }
          }
        }

        # COMPLIANCE & CERTIFICATIONS
        DangerousGoods
        DangerousGoodClass
        
        CE {
          ... on fieldcollection_CECertification {
            Certification {
              ... on asset {
                id
                filename
                fullpath
                assetThumbWeb: fullpath(thumbnail: "content", format: "webp")
              }
            }

            DoC {
              ... on asset {
                id
                filename
                fullpath
                assetThumbWeb: fullpath(thumbnail: "content", format: "webp")
              }
            }

            TestReport {
              ... on asset {
                id
                filename
                fullpath
                assetThumbWeb: fullpath(thumbnail: "content", format: "webp")
              }
            }
          }
        }

        GS {
          ... on fieldcollection_Certification {
            Certificate {
              ... on asset {
                id
                filename
                fullpath
                assetThumbWeb: fullpath(thumbnail: "content", format: "webp")
              }
            }

            TestReport {
              ... on asset {
                id
                filename
                fullpath
                assetThumbWeb: fullpath(thumbnail: "content", format: "webp")
              }
            }
          }
        }

        CCC {
          ... on fieldcollection_Certification {
            Certificate {
              ... on asset {
                id
                filename
                fullpath
                assetThumbWeb: fullpath(thumbnail: "content", format: "webp")
              }
            }

            TestReport {
              ... on asset {
                id
                filename
                fullpath
                assetThumbWeb: fullpath(thumbnail: "content", format: "webp")
              }
            }
          }
        }

        UL {
          ... on fieldcollection_Certification {
            Certificate {
              ... on asset {
                id
                filename
                fullpath
                assetThumbWeb: fullpath(thumbnail: "content", format: "webp")
              }
            }

            TestReport {
              ... on asset {
                id
                filename
                fullpath
                assetThumbWeb: fullpath(thumbnail: "content", format: "webp")
              }
            }
          }
        }
          }
        }
      }
    }
    `;
  }

  // 主要数据转换函数
  transformProductData(rawData) {
    const product = rawData.data?.getProductListing?.edges?.[0]?.node;

    if (!product) {
      throw new Error('Product not found');
    }

    return {
      productCardInfo: this.transformProductCardInfo(product),
      basicData: this.transformBasicData(product),
      sapData: this.transformSapData(product),
      marketingData: this.transformMarketingData(product),
      seoData: this.transformSeoData(product),
      referenceRelationship: this.transformReferenceRelationshipData(product),
      iconsPictures: this.transformIconsPicturesData(product),
      qrCodes: this.transformQrCodesData(product),
      eans: this.transformEansData(product),
      packagingData: this.transformPackagingData(product),
      packagingSpec: this.transformPackagingSpecData(product),
      marketingCollaterals: this.transformMarketingCollateralsData(product),
      afterService: this.transformAfterServiceData(product),
      skuData: this.transformSkuData(product),
      successor: this.transformSuccessorData(product),
      complianceCertifications: this.transformComplianceCertificationsData(product)
    };
  }

  transformSuccessorData(product) {
    const successor = product.Successor;
    if (!successor || !Array.isArray(successor)) return [];

    return successor.map(successor => ({
      productNumber: successor.CustomerFacingProductCode || successor.VirtualProductID || successor.id || '',
      productName: successor.ProductName || '',
      imageUrl: successor.Main?.assetThumb2 || '',
      assetId: successor.Main?.id || ''
    }));

  }

  // 合规认证数据转换
  transformComplianceCertificationsData(product) {
    const buildFullUrl = (url) => {
      return url && (url.startsWith('http') ? url : `https://pim-test.kendo.com${url}`);
    };

    const transformAssetArray = (assets) => {
      if (!assets || !Array.isArray(assets)) return [];
      return assets.map(asset => ({
        assetId: asset.id || '',
        filename: asset.filename || '',
        fullpath: asset.fullpath || '',
        thumbnailUrl: buildFullUrl(asset.assetThumbWeb || asset.fullpath || ''),
        downloadUrl: buildFullUrl(asset.fullpath || '')
      }));
    };

    // 转换认证数据为单个数组（参考 afterService 的 packaging 结构）
    const transformCertificationToArray = (certData, hasDoc = false, useCertificate = false) => {
      if (!certData || !Array.isArray(certData) || certData.length === 0) return [];
      const firstCert = certData[0];
      // CE 使用 Certification，GS/CCC/UL 使用 Certificate
      const certField = useCertificate ? firstCert.Certificate : firstCert.Certification;
      
      // 合并所有文档到一个数组
      const result = [
        ...transformAssetArray(certField),
        ...transformAssetArray(firstCert.TestReport)
      ];
      
      if (hasDoc && firstCert.DoC) {
        result.push(...transformAssetArray(firstCert.DoC));
      }
      
      return result;
    };

    return {
      dangerousGoods: {
        dangerousGoods: product.DangerousGoods || '',
        dangerousGoodClass: product.DangerousGoodClass || ''
      },
      ce: transformCertificationToArray(product.CE, true, false), // CE 合并 Certification、DoC、TestReport
      gs: transformCertificationToArray(product.GS, false, true), // GS 合并 Certificate、TestReport
      ccc: transformCertificationToArray(product.CCC, false, true), // CCC 合并 Certificate、TestReport
      ul: transformCertificationToArray(product.UL, false, true) // UL 合并 Certificate、TestReport
    };
  }

  // 产品卡片信息转换
  transformProductCardInfo(product) {
    return {
      productIdNumber: product.VirtualProductID ||  '',
      productNumber: product.CustomerFacingProductCode || product.id || '',
      productName: product.ProductName || '',
      developmentStatus: this.getDevelopmentStatus(product.EnrichmentStatus, product.LifecycleStatus),
      lifeCycleStatus: product.LifecycleStatus || '',
      enrichmentStatus: product.EnrichmentStatus || '',
      regionalLaunchDate: this.formatDate(product.OnlineDate),
      finalReleaseDate: this.formatDate(product.FirstShipmentDate),
      imageUrl: product.Main?.assetThumb2 || '',
      thumbnailUrl: product.Main?.assetThumb2 || '',
      assetId: product.Main?.id || ''
    };
  }

  // 基础数据转换
  transformBasicData(product) {
    return {
      productName: product.ProductName || '',
      onlineDate: this.formatDate(product.OnlineDate),
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
      createdOn: this.formatDate(product.creationDate),
      erpMaterialCode: product.ERPMaterialCode || '',
      abc: product.ABC || '',
      priceListUSD: this.formatQuantityValue(product.PriceListUSD),
      exportRestrictions: product.ExportRestrictions || '',
      inchMeasurementUnitMarkets: product.InchMeasurementUnitMarkets || ''
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
      popShortDescription: product.ShortDescription || '',
      longDescription: product.LongDescription || '',
      bulletTextListView: product.BulletTextListView || '',
      channelSpecificDescription: product.ChannelSpecificDescription || '',
      packagingContains: product.PackagingContains || '',
      benefits: product.Benefits || '',
      specifications: this.extractSpecifications(product.Specs) //这里未来应该改成marketingfeatures 待确认
    };
  }

  // SEO数据转换
  transformSeoData(product) {
    return {
      seoTitle: product.SEOTitle || '',
      seoKeywords: product.SEOKeywords || '',
      seoDescription: product.SEODescription || ''
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
            thumbnailUrl: icon.image.assetThumb2 || '',
            assetId: icon.image.id || ''
          });
        }
      });
    }
    return { icons };
  }

  // 二维码数据转换
  transformQrCodesData(product) {
    const qrCodes = [];
    Object.keys(product).forEach(key => {
      if (key.startsWith('WebsiteLink')) {
        const match = key.match(/WebsiteLink_[a-z]{2}_([A-Z]{2})/);
        const field = match ? match[1] : key.replace('WebsiteLink_', '').split('_').pop();
        const linkValue = product[key];
        const languageCode = key.replace('WebsiteLink_', '');
        const name = `Website Link (${languageCode})`;
        if (linkValue) {
          qrCodes.push({
            name: name,
            link: linkValue,
            field: field
          });
        }
      }
    });
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
    const marketingFeatures = [];
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

    if (product.MarketingFeatures && Array.isArray(product.MarketingFeatures)) {
      product.MarketingFeatures.forEach(feature => {
        const specItem = this.transformSpecFeature(feature);
        if (specItem) {
          marketingFeatures.push(specItem);
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
      imageGallery: this.transformImageCollection(product.ImageGallery),
      videos: this.transformVideoCollection([
        ...(product.ProductVideos || []),
        ...(product.CategoryVideos || [])
      ])
    };
  }

  // 售后服务数据转换
  transformAfterServiceData(product) {
    // 合并所有包装相关的数据
    const packagingData = [
      ...this.transformAfterServiceCollection(product.PackingGuideline),
      ...this.transformAfterServiceCollection(product.InnerCartonArtwork),
      ...this.transformAfterServiceCollection(product.MasterCartonArtwork),
      ...this.transformAfterServiceCollection(product.SalesPackagingArtwork)
    ];

    // 合并所有绘图相关的数据
    const drawingData = [
      ...this.transformAfterServiceCollection(product.ProductDrawing),
      ...this.transformAfterServiceCollection(product.MoldDrawing),
      ...this.transformAfterServiceCollection(product.ProductLineDrawing)
    ];

    return {
      manuals: this.transformAfterServiceCollection(product.Manuals),
      repairGuide: this.transformAfterServiceCollection(product.RepairGuides),
      packaging: packagingData,
      drawing: drawingData,
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
      product.ProductName,
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
        return feature.text ? `${feature.title}: ${feature.text}` : null;
      case 'csFeatureSelect':
        return feature.selection ? `${feature.title}: ${feature.selection}` : null;
      case 'csFeatureNumeric':
        return feature.number ? `${feature.title}: ${feature.number}` : null;
      case 'csFeatureQuantityValue':
        if (feature.quantityvalue && feature.quantityvalue.value) {
          return `${feature.title}: ${feature.quantityvalue.value}`;
        }
        return null;
      case 'csFeatureBooleanSelect':
        return feature.checked ? `${feature.title}: Yes` : null;
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

    return bundles.map(bundle => {
      let redirectId = '';

      // 判断产品类型来确定 redirectId
      if (bundle.CustomerFacingProductCode) {
        // 如果是 SKU，redirectId 就是 CustomerFacingProductCode
        redirectId = bundle.CustomerFacingProductCode;
      } else if (bundle.VirtualProductID || bundle.objectType === 'virtual-product') {
        // 如果是 virtual-product，从 children 获取第一个 CustomerFacingProductCode
        if (bundle.children && Array.isArray(bundle.children) && bundle.children.length > 0) {
          redirectId = bundle.children?.[0]?.CustomerFacingProductCode;
        }
      }

      return {
        productNumber: bundle.CustomerFacingProductCode || bundle.VirtualProductID || bundle.id || '',
        redirectId: redirectId,
        productName: bundle.ProductName || '',
        imageUrl: bundle.Main?.assetThumb2,
        assetId: bundle.Main?.id || ''
      };
    });
  }

  transformComponents(components) {
    if (!components || !Array.isArray(components)) return [];

    return components.map(comp => {
      const element = comp.element;
      let redirectId = '';

      // 判断产品类型来确定 redirectId
      if (element?.CustomerFacingProductCode) {
        // 如果是 SKU，redirectId 就是 CustomerFacingProductCode
        redirectId = element.CustomerFacingProductCode;
      } else if (element?.VirtualProductID || element?.objectType === 'virtual-product') {
        // 如果是 virtual-product，从 children 获取第一个 CustomerFacingProductCode
        if (element?.children && Array.isArray(element.children) && element.children.length > 0) {
          redirectId = element.children?.[0]?.CustomerFacingProductCode;
        }
      }

      return {
        productNumber: element?.CustomerFacingProductCode || element?.VirtualProductID || element?.id || '',
        redirectId: redirectId,
        productName: element?.ProductName || '',
        imageUrl: element?.Main?.assetThumb2 || '',
        assetId: element?.Main?.id || ''
      };
    });
  }

  transformAccessories(accessories) {
    if (!accessories || !Array.isArray(accessories)) return [];

    return accessories.map(acc => {
      const element = acc.element;
      let redirectId = '';

      // 判断产品类型来确定 redirectId
      if (element?.CustomerFacingProductCode) {
        // 如果是 SKU，redirectId 就是 CustomerFacingProductCode
        redirectId = element.CustomerFacingProductCode;
      } else if (element?.VirtualProductID || element?.objectType === 'virtual-product') {
        // 如果是 virtual-product，从 children 获取第一个 CustomerFacingProductCode
        if (element?.children && Array.isArray(element.children) && element.children.length > 0) {
          redirectId = element.children?.[0]?.CustomerFacingProductCode;
        }
      }

      return {
        imageUrl: element?.Main?.assetThumb2 || '',
        model: element?.CustomerFacingProductCode || element?.VirtualProductID || element?.id || '',
        redirectId: redirectId,
        name: element?.ProductName || '',
        quantity: parseInt(element?.Quantity) || 0,
        assetId: element?.Main?.id || ''
      };
    });
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
        assetId: image.id || '',
        downloadUrl: image.fullpath || '',
        fileName: image.filename || '',
        keywords: this.extractKeywords(image.metadata), // 新增keywords字段
        // Basic Info - 参考 useAssetInfo.js 的字段映射
        basicInfo: {
          // modelNumber: this.extractMetadataValue(image.metadata, 'Model Number'),
          mediaType: this.extractMetadataValue(image.metadata, 'Media Type'),
          usage: this.extractMetadataValue(image.metadata, 'Media Usage') || 'Internal',
          language: this.extractMetadataValue(image.metadata, 'Media Language'),
          languages: this.parseLanguages(image.metadata), // 数组格式
          tags: this.extractKeywords(image.metadata), // 使用 extractKeywords (Media Key Words)
          productIds: this.parseProductIds(image.metadata), // 数组格式
          productIdsString: this.extractMetadataValue(image.metadata, 'Media Product IDs'), // 原始字符串
          approvalStatus: this.parseApprovalStatus(image.metadata), // 数组格式
          approvalStatusString: this.extractMetadataValue(image.metadata, 'Media Approval Status') // 原始字符串
        },
        // Automatic/Technical Fields - 参考 useAssetInfo.js 的字段映射
        technical: {
          name: image.filename || '',
          width: image.dimensions?.width || 0,
          height: image.dimensions?.height || 0,
          dimensions: `${image.dimensions?.width || 0} x ${image.dimensions?.height || 0}`,
          size: this.formatFileSize(image.filesize),
          sizeBytes: image.filesize || 0,
          createdOn: this.formatDateTime(image.creationDate),
          // createdOnRaw: image.creationDate,
          changeDate: this.formatDateTime(image.modificationDate),
          // changeDateRaw: image.modificationDate
        }
      };
    });
  }

  transformVideoCollection(videos) {
    if (!videos || !Array.isArray(videos)) return [];

    return videos.map(video => ({
      thumbnailUrl: video.assetThumb2 || '',
      assetId: video.id || '',
      downloadUrl: video.fullpath || '',
      videoTitle: this.extractMetadataValue(video.metadata, 'title') || video.filename || '',
      language: this.extractMetadataValue(video.metadata, 'language') || '',
      type: this.extractMetadataValue(video.metadata, 'type') || '',
      format: 'Video',
      duration: this.extractMetadataValue(video.metadata, 'duration') || '',
      keywords: this.extractKeywords(video.metadata, 'Video Key Words') // 新增keywords字段
    }));
  }

  transformAfterServiceCollection(collection) {
    if (!collection || !Array.isArray(collection)) return [];

    return collection.map(item => ({
      thumbnailUrl: item.assetThumb2 || '',
      assetId: item.id || '',
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

  // 提取关键词作为keywords数组
  extractKeywords(metadata, keywordFieldName = 'Media Key Words') {
    if (!metadata || !Array.isArray(metadata)) return [];
    const keywordsItem = metadata.find(m => m.name === keywordFieldName);
    if (!keywordsItem || !keywordsItem.data) return [];

    // 如果data是字符串，按分号分割；如果已经是数组，直接返回
    if (typeof keywordsItem.data === 'string') {
      return keywordsItem.data.split(';').map(keyword => keyword.trim()).filter(keyword => keyword.length > 0);
    }

    return Array.isArray(keywordsItem.data) ? keywordsItem.data : [];
  }

  // 解析语言列表
  parseLanguages(metadata) {
    const languageValue = this.extractMetadataValue(metadata, 'Media Language');
    if (!languageValue) return [];
    return languageValue.split(',').map(lang => lang.trim()).filter(Boolean);
  }

  // 解析 Product IDs
  parseProductIds(metadata) {
    const productIdsValue = this.extractMetadataValue(metadata, 'Media Product IDs');
    if (!productIdsValue) return [];
    return productIdsValue.split(/[;,]/).map(id => id.trim()).filter(Boolean);
  }

  // 解析 Approval Status
  parseApprovalStatus(metadata) {
    const statusValue = this.extractMetadataValue(metadata, 'Media Approval Status');
    if (!statusValue) return [];
    return statusValue.split(/[;,]/).map(status => status.trim()).filter(Boolean);
  }

  // 格式化日期为 MM/DD/YYYY HH:mm:ss
  formatDateTime(dateInput) {
    if (!dateInput) return '';

    let date;
    if (typeof dateInput === 'number') {
      date = new Date(dateInput * 1000);
    } else if (typeof dateInput === 'string') {
      date = new Date(dateInput);
    } else {
      return '';
    }

    if (isNaN(date.getTime())) return '';

    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${month}/${day}/${year} ${hours}:${minutes}:${seconds}`;
  }

  formatFileSize(bytes) {
    if (bytes == null || bytes === 0) return '';
    const mb = bytes / 1_000_000; // 十进制：1 MB = 1,000,000 bytes
    // console.log('formatFileSize', bytes, mb.toFixed(2));

    return `${mb.toFixed(2)} MB`;
  }


  formatQuantityValue(quantityValue) {
    if (!quantityValue || !quantityValue.value) return '';

    const value = quantityValue.value;
    const unit = quantityValue.unit?.abbreviation || quantityValue.unit?.longname || '';

    return unit ? `${value} ${unit}` : value.toString();
  }

  // 获取产品详情
  async getProductDetail(skuid, defaultLanguage = 'en', useBackendApi = false) {
    try {
      // 如果使用后端接口
      if (useBackendApi) {
        return await this.getProductDetailFromBackend(skuid, defaultLanguage);
      }

      // 默认使用前端转换逻辑
      const filter = {
        CustomerFacingProductCode: { "$like": skuid }
      };
      const query = this.buildProductQuery(1, 0, filter, defaultLanguage);

      const response = await fetch(this.baseURL, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          query: query
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

  // 从后端API获取产品详情
  async getProductDetailFromBackend(skuid, defaultLanguage = 'en') {
    try {
      const token = CookieService.getToken();
      const backendUrl = `/srv/v1/main/pdp?skuId=${encodeURIComponent(skuid)}&lang=${encodeURIComponent(defaultLanguage)}`;

      const response = await fetch(backendUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Backend API response:', data);

      return data;
    } catch (error) {
      console.error('Error fetching product detail from backend:', error);
      throw error;
    }
  }

  // SKU数据转换
  transformSkuData(product) {
    // 从 parent.children 中获取 SKU 数据
    const children = product.parent?.children || [];

    return children.map(child => ({
      productNumber: child.CustomerFacingProductCode || child.id || '',
      size: child.Size || '',
      mainMaterial: child.MainMaterial || '',
      surfaceFinish: child.SurfaceFinish || '',
      unitPackingItem: child.UnitPackingItem || '',
      innerBoxQuantity: child.InnerBoxQuantity || '',
      masterCartonQuantity: child.MCQuantity || '',
      applicableStandard: child.ApplicableStandard || ''
    }));
  }

  // 批量获取产品详情
  async getProductDetails(skuids, defaultLanguage = 'en', useBackendApi = false) {
    try {
      const promises = skuids.map(skuid => this.getProductDetail(skuid, defaultLanguage, useBackendApi));
      const results = await Promise.allSettled(promises);

      return results.map((result, index) => ({
        id: skuids[index],
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

