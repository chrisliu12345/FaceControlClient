//警情数据
imApp.service('news', function(){
    this.list = [
        {
            id: 0,
            title: '黄村绑架案',
            time: '2017-05-28 13:20:11',
            position: '黄村二大街',
            level: '重大',
            description: '110接到报警称，一名刘姓男子被绑架到有煤气和乙炔的集装箱内。该集装箱位于一厂区内，厂区位于居民区附近，厂区旁有加油站和高压变电站'
        },
        {
            id: 1,
            title: '海淀人口失踪案',
            time: '2017-05-23 13:20:11',
            position: '中关村',
            level: '一般',
            description: '110接到报警称，一名刘姓男子失踪了'
        },
        {
            id: 2,
            title: '朝阳吸毒案',
            time: '2017-05-25 13:20:11',
            position: '朝阳公园',
            level: '轻微',
            description: '110接到报警称，一名刘姓男子吸毒了'
        },
        {
            id: 3,
            title: '丰台嫖娼案',
            time: '2017-05-27 13:20:11',
            position: '丰台科技园',
            level: '一般',
            description: '110接到报警称，一名刘姓男子嫖娼了'
        }
    ];
    this.getList = function(){
        return this.list;
    }
    this.findItemById = function(id){
        return this.list[id];
    }
})