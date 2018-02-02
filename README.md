# 在线开发平台帮助文档

## 平台功能简介
## 开发者与系统管理员
## 应用的概念与分类

## 模板语言freeMarker
### freeMarker简介
FreeMarker 是一款模板引擎：即一种基于模板、用来生成输出文本(任何来自于 HTML格式的文本用来自动生成源代码)的通用工具。  
FreeMarker 实际上是被设计用来生成 HTML 页面，尤其是通过实现了基于 MVC(Model View Controller， 模型-视图-控制器)模式的 Java Servlet 应用程序。

![freemarker](http://a0.leadongcdn.cn/cloud/iqBqiKimRijSmpnrlnjo/overview.png)

### freeMarker工作原理
假设在一个应用系统中需要一个HTML页面如下：

```
<html>
    <head>
        <title>Welcome!</title>
    </head>
    <body>
        <h1>Welcome Big Joe!</h1>
        <p>Our latest product:
        <a href="products/greenmouse.html">green mouse</a>!
    </body>
</html>
```
页面中的用户名（即上面的“Big Joe”）是登录这个网页的访问者的名字，并且最新产品的数据应该来自于数据库才能随时更新。所以，不能直接在HTML页面中输入“Big Joe”、“greenmouse”及链接，不能使用静态HTML代码。可以使用要求输出的模板来解决，模板和静态页面是相同的，只是它会包含一些FreeMarker将它们变成动态内容的指令：
```
<html>
    <head>
        <title>Welcome!</title>
    </head>
    <body>
        <h1>Welcome ${user}!</h1>
        <p>Our latest product:
        <a href="${latestProduct.url}">${latestProduct.name}</a>!
    </body>
</html>
```
模板文件存放在Web服务器上，当有人来访问这个页面，FreeMarker就会介入执行，然后动态转换模板，用最新的数据内容替换模板中${...}的部分，之后将结果发送到访问者的Web浏览器中。访问者的Web浏览器就会接收到例如第一个HTML示例那样的内容（也就是没有FreeMarker指令的HTML代码），访问者也不会察觉到服务器端使用的FreeMarker。（存储在Web服务器端的模板文件是不会被修改的；替换也仅仅出现在Web服务器的响应中。）  
为模板准备的数据整体被称作为数据模型。数据模型是树形结构（就像硬盘上的文件夹和文件)，在视觉效果上， 数据模型可以是（这只是一个形象化显示，数据模型不是文本格式，它来自于Java对象）：
```
(root)
  |
  +- user = "Big Joe"
  |
  +- latestProduct
      |
      +- url = "products/greenmouse.html"
      |
      +- name = "green mouse"
```
早期版本中，可以从数据模型中选取这些值，使用user和latestProduct.name表达式即可。类比于硬盘的树形结构，数据模型就像一个文件系统，“(root)”和latestProduct就对应着目录（文件夹），而user、url和name就是这些目录中的文件。   
总体上，模板和数据模型是FreeMarker来生成输出所必须的组成部分：模板 + 数据模型 = 输出。
### freeMarker基本语法
- ${...}：FreeMarker将会输出真实的值来替换大括号内的表达式，这样的表达式被称为interpolation（插值）。
- 注释：注释和HTML的注释也很相似，但是它们使用<#-- and -->来标识。不像HTML注释那样，FTL注释不会出现在输出中（不出现在访问者的页面中），因为FreeMarker会跳过它们。
- FTL标签（FreeMarker模板的语言标签）：FTL标签和HTML标签有一些相似之处，但是它们是FreeMarker的指令，是不会在输出中打印的。这些标签的名字以#开头。（用户自定义的FTL标签则需要使用@来代替#）  
#### 指令
```
<#if condition>
    ...
<#elseif condition2>
    ...
<#elseif condition3>
    ...
<#else>
    ...
</#if>
```
if、elseif和else指令可以用来条件判断是否越过模板的一个部分。condition必须计算成布尔值，否则错误将会中止模板处理。elseif和else必须出现在if内部（也就是在if的开始标签和结束标签之间）。if中可以包含任意数量的elseif（包括0个），而结束时else也是可选的。
```
假设 users 包含['Joe', 'Kate', 'Fred'] 序列：
<#list users as user>
    <p>${user}
</#list>
 
输出：
    <p>Joe
    <p>Kate
    <p>Fred
```
list指令执行在list开始标签和list结束标签（list中间的部分）之间的代码，对于在序列（或集合）中每个值指定为它的第一个参数。对于每次迭代，循环变量将会存储当前项的值。循环变量仅仅存在于list标签体内。而且从循环中调用的宏/函数不会看到它（就像它只是局部变量一样）。<#list>与<#else>、<#sep>组合是可选的，而且仅从FreeMarker 2.3.23版本开始支持。
```
将版权信息单独存放在页面文件 copyright_footer.html 中：
<hr>
<i>
    Copyright (c) 2000 <a href="http://www.baidu.com">Baidu Inc</a>,
    <br>
    All Rights Reserved.
</i>
 
当需要用到这个文件时，可以使用 include 指令来插入：
<html>
    <head>
        <title>Test page</title>
    </head>
    <body>
        <h1>Test page</h1>
        <p>Blah blah...
        <#include "/copyright_footer.html">
    </body>
</html>
```
include可以在模板中插入另外一个FreeMarker模板文件（由路径参数指定)。被包含模板的输出格式是在include标签出现的位置插入的。被包含的文件和包含它的模板共享变量，就像是被复制粘贴进去的一样。include指令不能由被包含文件的内容所替代，它只是当FreeMarker每次在模板处理期间到达include指令时处理被包含的文件。所以对于如果include在list循环之中的例子，可以为每个循环周期内指定不同的文件名。
#### 内建函数
内建函数很像子变量（也像Java中的方法），它们并不是数据模型中的东西，是FreeMarker在数值上添加的。为了清晰子变量是哪部分，使用?（问号）代替，.（点）来访问它们。常用内建函数的示例：   
- user?html给出user的HTML转义版本，比如&会由&amp;来代替。
- user?upper_case给出user值的大写版本（比如“JOHN DOE”来替代“John Doe”）
- user?length给出user值中字符的数量（对于“John Doe”来说就是8）
- animals?size给出animals序列中项目的个数
- 如果在<#list animals as animal>和对应的</#list>标签中：  
—— animal?index给出了在animals中基于0开始的animal的索引值  
—— animal?counter也像index，但是给出的是基于1的索引值  
—— animal?item_parity基于当前计数的奇偶性，给出字符串“odd”或“even”。在给不同行着色时非常有用，比如在<td class="${animal?item_parity}Row">中。  
一些内建函数需要参数来指定行为，比如：  
- animal.protected?string("Y", "N")基于animal.protected的布尔值来返回字符串“Y”或“N”。  
- animal?item_cycle('lightRow','darkRow')是item_parity更为常用的变体形式。
- fruits?join(", ")通过连接所有项，将列表转换为字符串，在每个项之间插入参数分隔符（比如“orange,banana”）
- user?starts_with("J")根据user的首字母是否是“J”返回布尔值true或false。    

内建函数应用可以链式操作，比如user?upper_case?html会先转换用户名到大写形式，之后再进行HTML转义，和链式使用.（点）一样。  
#### 空变量
数据模型中经常会有可选的变量（有时并不存在）。除了一些人为原因导致失误外，FreeMarker不能引用不存在的变量，除非明确地告诉它当变量不存在时如何处理，如下两种典型的处理方法：  
　　这部分对程序员而言：一个不存在的变量和一个是null值的变量，对于FreeMarker来说是一样的，所以这里所指的“丢失”包含这两种情况。  
　　不论在哪里引用变量，都可以指定一个默认值来避免变量丢失这种情况，通过在变量名后面跟着一个 !（感叹号）和默认值。像下面的这个例子，当user不存在于数据模型时，模板将会将user的值表示为字符串 “visitor”。（当 user 存在时，模板就会表现出 ${user} 的值）：
　　
```
<h1>Welcome ${user!"visitor"}!</h1>
```

也可以在变量名后面通过放置??来询问一个变量是否存在。将它和if指令合并，那么如果user变量不存在的话将会忽略整个问候的代码段：

```
<#if user??>
    <h1>Welcome ${user}!</h1>
</#if>
```
关于多级访问的变量，比如 animals.python.price，书写代码：animals.python.price!0当且仅当animals.python永远存在，而仅仅最后一个子变量price可能不存在时是正确的（这种情况下假设价格是0）。如果 animals或python不存在，那么模板处理过程将会以“未定义的变量”错误而停止。为了防止这种情况的发生， 可以如下这样来编写代码(animals.python.price)!0。这种情况就是说animals或python不存在时，表达式的结果是 0。对于??也是同样用来的处理这种逻辑的；将animals.python.price??对比(animals.python.price)??来看。　　

[详情参见FreeMarker参考手册](http://freemarker.foofun.cn/toc.html)
## 如何创建一个应用

![image](http://a0.leadongcdn.cn/cloud/iiBqiKimRijSmpprnnjq/chuangjian.png)  

![image](http://a0.leadongcdn.cn/cloud/iqBqiKimRijSmpprinjo/qukuai.png)
下图为填写的示例字段
![image](http://a0.leadongcdn.cn/cloud/ilBqiKimRijSmpprmljq/qukuai.png)

![image](http://a0.leadongcdn.cn/cloud/irBqiKimRijSmpjirljo/qukuaib.png)

![image](http://a0.leadongcdn.cn/cloud/ipBqiKimRijSmpprjnjo/qukuai.png)

![image](http://a0.leadongcdn.cn/cloud/ioBqiKimRijSmpprrnjo/qukuai.png)

![image](http://a0.leadongcdn.cn/cloud/ijBqiKimRijSmppronjq/qukuai.png)
保存完毕之后，包裹的标签里会自动生成一个data-auto_uuid属性
![image](http://a0.leadongcdn.cn/cloud/irBqiKimRijSmpprlnjq/qukuai.png)

![image](http://a0.leadongcdn.cn/cloud/imBqiKimRijSmpprknjo/qukuai.png)

![image](http://a0.leadongcdn.cn/cloud/irBqiKimRijSmpprjqjq/qukuai.png)

![image](http://a0.leadongcdn.cn/cloud/ikBqiKimRijSmpprnqjq/qukuai.png)

![image](http://a0.leadongcdn.cn/cloud/imBqiKimRijSmppriqjo/qukuai.png)

如下图，生成了三个可编辑的模块

![image](http://a0.leadongcdn.cn/cloud/irBqiKimRijSmpprkojq/qukuai.png)

![image](http://a0.leadongcdn.cn/cloud/iiBqiKimRijSmpprlojq/qukuai.png)

![image](http://a0.leadongcdn.cn/cloud/ijBqiKimRijSmpprnojq/qukuai.png)

## 组件开发攻略
	### 组件后台设置项
	### html（freemaker）代码
	### 静态资源 css js 与 图片管理
	### css与js引用
	### 国际化文本

## 区块开发攻略
	### html（freemaker）代码
	### 静态资源 css js 与 图片管理
	### css与js引用
	### 静态模板与动态数据模板
	### 国际化文本


## 示例代码

[demo.html](demo.html)

[demo.js](demo.js)

