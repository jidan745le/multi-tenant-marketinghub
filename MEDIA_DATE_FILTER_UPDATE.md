# Media Date Filter Enhancement

媒体资产页面新增了基于 `creationDate` 字段的日期过滤功能，支持GraphQL的日期比较操作符。

## 🚀 新功能特性

### 1. GraphQL查询支持
现在GraphQL查询包含 `creationDate` 字段：

```graphql
{
  getAssetListing(
    first: 10, 
    after: 1,
    filter: "{\"mimetype\": {\"$not\": \"\"}}"
  ) {
    totalCount
    edges {
      cursor
      node {
        ... on asset {
          id
          fullpath
          filename
          mimetype
          filesize
          creationDate  # 新增字段
          # ... 其他字段
        }
      }
    }
  }
}
```

### 2. 支持的比较操作符
- `$gt` - 大于 (greater than)
- `$gte` - 大于等于 (greater than or equal)
- `$lt` - 小于 (less than)  
- `$lte` - 小于等于 (less than or equal)

### 3. 过滤条件示例

#### 日期范围过滤
```javascript
// 查询2024年1月1日到2024年12月31日的资产
const filters = {
  'creation-date-from': '2024-01-01',
  'creation-date-to': '2024-12-31'
};
```

#### 单一日期条件
```javascript
// 查询2024年6月1日之后创建的资产
const filters = {
  'creation-date-from': '2024-06-01'
};

// 查询2024年6月1日之前创建的资产
const filters = {
  'creation-date-to': '2024-06-01'
};
```

## 🔧 实现细节

### 1. 服务层更新 (`src/services/kendoAssetsApi.js`)

#### GraphQL查询更新
```javascript
// 新增creationDate字段
node {
  ... on asset {
    id
    fullpath
    creationDate  // 新增
    // ... 其他字段
  }
}
```

#### 过滤逻辑更新
```javascript
// 按创建日期范围筛选
if (filters['creation-date-from'] || filters['creation-date-to']) {
    const dateConditions = {};
    
    if (filters['creation-date-from']) {
        dateConditions["$gte"] = filters['creation-date-from'];
    }
    
    if (filters['creation-date-to']) {
        dateConditions["$lte"] = filters['creation-date-to'];
    }
    
    if (Object.keys(dateConditions).length > 0) {
        allConditions.push({ creationDate: dateConditions });
    }
}
```

### 2. 适配器更新 (`src/adapters/kendoAssetsAdapter.js`)

```javascript
// 使用API提供的创建日期
createdDate: assetNode.creationDate ? 
    assetNode.creationDate.split('T')[0] : 
    new Date().toISOString().split('T')[0]
```

### 3. 配置更新 (`src/config/kendoMediaConfig.js`)

#### 新的日期范围选择器
```javascript
{
    order: 51,
    label: 'Creation Date Range',
    component: 'daterange',
    key: 'creation-date-range',
    type: 'object',
    defaultValue: { from: '', to: '' },
    children: [
        {
            label: 'From Date',
            component: 'input',
            key: 'creation-date-from',
            type: 'date',
            placeholder: 'YYYY-MM-DD'
        },
        {
            label: 'To Date', 
            component: 'input',
            key: 'creation-date-to',
            type: 'date',
            placeholder: 'YYYY-MM-DD'
        }
    ]
}
```

#### 保留快速日期过滤器
```javascript
{
    order: 52,
    label: 'Quick Date Filter',
    component: 'radio',
    key: 'creation-date',
    type: 'string',
    defaultValue: 'all',
    enum: creationDateOptions  // Last 2 weeks, Last 1 month, etc.
}
```

## 🔍 调试信息

### 1. GraphQL查询日志
```javascript
console.log('🔍 Assets GraphQL Query Filter:', {
    rawFilters: filters,
    processedConditions: filterConditions,
    dateFilters: {
        hasDateRange: !!(filters['creation-date-from'] || filters['creation-date-to']),
        fromDate: filters['creation-date-from'],
        toDate: filters['creation-date-to'],
        quickFilter: filters['creation-date']
    }
});
```

### 2. API包装函数日志
```javascript
console.log('📅 Date filters applied:', {
    fromDate: params['creation-date-from'],
    toDate: params['creation-date-to'], 
    quickFilter: params['creation-date']
});

console.log('📅 Sample asset creation dates:', assets.map(asset => ({
    filename: asset.filename,
    createdDate: asset.createdDate,
    mediaType: asset.mediaType
})));
```

## 🧪 使用示例

### 1. 查询最近一周的图片资产
```javascript
const params = {
  'media-type': ['Images'],
  'creation-date': 'last_2_weeks'
};
```

### 2. 查询指定日期范围的视频资产
```javascript
const params = {
  'media-type': ['Videos'],
  'creation-date-from': '2024-01-01',
  'creation-date-to': '2024-06-30'
};
```

### 3. 查询2024年后的所有文档
```javascript
const params = {
  'media-type': ['Documents'],
  'creation-date-from': '2024-01-01'
};
```

## 🚨 注意事项

1. **日期格式**: 使用 `YYYY-MM-DD` 格式
2. **时区**: GraphQL API返回的日期可能包含时区信息，适配器会自动提取日期部分
3. **向后兼容**: 保留了原有的快速日期过滤选项
4. **性能**: 日期范围过滤在服务端执行，提高查询效率
5. **调试**: 增加了详细的日志输出用于故障排除

## 🔮 扩展可能

### 1. 时间范围过滤
```javascript
// 支持时间戳过滤
'creation-datetime-from': '2024-01-01T09:00:00Z'
```

### 2. 相对日期过滤
```javascript
// 支持相对日期
'creation-date-relative': 'last_7_days'
```

### 3. 批量日期操作
```javascript
// 支持多个日期条件
'creation-date-conditions': [
  { operator: '$gte', value: '2024-01-01' },
  { operator: '$lt', value: '2024-07-01' }
]
``` 