
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

    // GraphQL查询语句
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
        ABC
        
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
          assetThumb: fullpath(thumbnail: "content")
          assetThumb2: fullpath(thumbnail: "content", format: "webp")
          resolutions(thumbnail: "content", types: [2, 5]) {
            resolution
            url
          }
        }
        
        # BASIC DATA
        Brand
        ProductType
        VirtualProductID
        version
        CustomerFacingProductCode
        Sellable
        id
        classname
        CountryOfOrigin
        Warranty
        modificationDate
        LifecycleStatus
        EnrichmentStatus
        FirstShipmentDate
        creationDate
        
        # SAP DETAIL
        MeasurementUnitIN
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
        
        ExplodedImage {
          image {
            id
          }
        }
        
        OnWhite {
          image {
            filename
            fullpath
            id
            filesize
            srcset(thumbnail: "content") {
              descriptor
              url
              __typename
            }
          }
        }
        
        Icons {
          crop {
            cropWidth
          }
          image {
            filename
            fullpath
            filesize
            duration
          }
        }
        
        ProductDimensions
        InnerBoxQuantity
        
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
            }
          }
        }
        
        Components {
          element {
            ... on object_Product {
              ProductName
            }
          }
        }
        
        InnerCartonArtwork {
          __typename
          ... on asset {
            dimensions {
              width
            }
            data
            filename
          }
        }
        
        MCVolumeM3
        ProductType
        DigitalAssets
      }
    }
  `;

    // 数据转换函数
    transformProductData(rawData) {
        const product = rawData.data?.getProduct;
        if (!product) {
            throw new Error('Product not found');
        }

        // 转换产品卡片信息
        const productCardInfo = {
            productNumber: product.VirtualProductID || product.id || '',
            productName: product.ProductName_en || product.ProductName || '',
            developmentStatus: product.EnrichmentStatus || 'Unknown',
            lifeCycleStatus: product.LifecycleStatus || 'Unknown',
            enrichmentStatus: product.EnrichmentStatus || 'Unknown',
            regionalLaunchDate: product.OnlineDate ? new Date(product.OnlineDate).toISOString().split('T')[0] : '',
            finalReleaseDate: product.FirstShipmentDate ? new Date(product.FirstShipmentDate).toISOString().split('T')[0] : '',
            imageUrl: product.Main?.fullpath || product.OnWhite?.image?.fullpath || '',
            thumbnailUrl: product.Main?.assetThumb || product.Main?.assetThumb2 || ''
        };

        // 转换基础数据
        const basicData = {
            brand: product.Brand || '',
            region: 'EMEA', // 默认值，可根据实际情况调整
            productType: product.ProductType || '',
            modelNumber: product.VirtualProductID || product.id || '',
            version: product.version?.toString() || '1.0',
            customerFacingModel: product.CustomerFacingProductCode || product.VirtualProductID || '',
            productSeries: product.CategoryName || '',
            sellable: product.Sellable || false,
            recognition: null, // 数据中未提供
            productNumber: product.VirtualProductID || product.id || '',
            productClassification: product.classname || null,
            countryOfOrigin: product.CountryOfOrigin || '',
            warranty: product.Warranty || '',
            lastChangedOn: product.modificationDate ? new Date(product.modificationDate).toISOString().split('T')[0] : '',
            lifeCycleStatus: product.LifecycleStatus || '',
            enrichmentStatus: product.EnrichmentStatus || '',
            firstShippingDate: product.FirstShipmentDate ? new Date(product.FirstShipmentDate).toISOString().split('T')[0] : '',
            createdOn: product.creationDate ? new Date(product.creationDate).toISOString().split('T')[0] : ''
        };

        // 转换SAP数据
        const sapData = {
            basicUnitOfMeasurement: product.MeasurementUnitIN || 'EA',
            productDimensions: product.ProductDimensions || undefined,
            consolidationSkuNumbers: product.ConsolidationSKUNumbers || undefined,
            factoryInstructionCn: product.FactoryInstructionCN || '',
            sapShortDescriptionEn: product.SAPShortDescriptionEN || ''
        };

        // 转换营销数据
        const marketingData = {
            modelName: product.VirtualProductID || product.ProductName || '',
            categoryBullets: this.extractCategoryBullets(product),
            popShortDescription: product.ShortDescription_en || product.ShortDescription || '',
            longDescription: product.LongDescription_en || product.LongDescription || '',
            packagingContains: product.PackagingContains || '',
            specifications: this.extractSpecifications(product.Specs)
        };

        return {
            productCardInfo,
            basicData,
            sapData,
            marketingData
        };
    }

    // 提取分类标签
    extractCategoryBullets(product) {
        const bullets = [];

        if (product.CategoryName) {
            bullets.push(product.CategoryName);
        }

        if (product.ProductLabel) {
            bullets.push(product.ProductLabel);
        }

        if (product.Brand && product.CategoryName) {
            bullets.push(`${product.Brand} ${product.CategoryName}`);
        }

        if (product.ProductName_en) {
            bullets.push(product.ProductName_en);
        }

        return bullets.filter((bullet, index, self) => self.indexOf(bullet) === index); // 去重
    }

    // 提取规格信息
    extractSpecifications(specs) {
        if (!specs || !Array.isArray(specs)) return '';

        const specStrings = [];

        specs.forEach(spec => {
            if (spec.__typename === 'csGroup' && spec.features) {
                spec.features.forEach(feature => {
                    if (feature.__typename === 'csFeatureInput' && feature.text) {
                        specStrings.push(`${feature.name}: ${feature.text}`);
                    } else if (feature.__typename === 'csFeatureSelect' && feature.selection) {
                        specStrings.push(`${feature.name}: ${feature.selection}`);
                    } else if (feature.__typename === 'csFeatureNumeric' && feature.number) {
                        specStrings.push(`${feature.name}: ${feature.number}`);
                    }
                });
            }
        });

        return specStrings.join(', ');
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

            return this.transformProductData(rawData);
        } catch (error) {
            console.error('Error fetching product detail:', error);
            throw error;
        }
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
