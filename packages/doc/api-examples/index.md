<script setup>
import { baseUrl } from './baseurl'
</script>

# API 说明

baseUrl 是 `{{ baseUrl }}`，部署在 [Cloudflare Workers](https://workers.cloudflare.com/)

基本的返回值类型是

```json
{
    "code": 200,
    "message": "success",
    "data": {}, // 也可能是 [] 或者直接是 string 之类的
    "success": true
}
```

如果有出错的话里面部分信息会改变，但是基本结构不会变

## 错误码

### 200

成功

### 404

没有找到

### 5000

系统错误

### 5001

参数错误
