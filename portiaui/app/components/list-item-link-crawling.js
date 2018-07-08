import Ember from 'ember';
import SaveSpiderMixin from '../mixins/save-spider-mixin';
const { computed, inject: { service } } = Ember;

export default Ember.Component.extend(SaveSpiderMixin, {
    routing: service('-routing'),
    tagName: '',

    spider: null,

    followPatternOptions: [
        {
            value: 'auto',
            label: '自动爬取链接',
            description: `使用开始网址和示例网址向爬虫传授最佳链接`
        },
        {
            value: 'all',
            label: '爬取域名下的所有链接',
            description: `爬取具有与起始或示例网址匹配的域或子域的所有链接`
        },
        {
            value: 'none',
            label: "不爬取链接",
            description: `仅尝试从开始URL提取数据。可以与feed和生成的url结合使用效果很好`
        },
        {
            value: 'patterns',
            label: '配置URL模式',
            description: `为爬虫创建模式以遵循或不遵循，并以引脚点精度指导您的爬虫`
        },
    ],

    linksToFollow: computed('spider.linksToFollow', {
        get() {
            return this.followPatternOptions.findBy('value', this.get('spider.linksToFollow'));
        },

        set(key, value) {
            this.set('spider.linksToFollow', value.value);
            return value;
        }
    }),

    actions: {
        saveSpider() {
            this.saveSpider().then(() => {
                if (this.get('linksToFollow.value') === 'patterns') {
                    this.get('routing').transitionTo('projects.project.spider.link-options');
                } else if (this.get('linksToFollow.value') === 'none' &&
                        this.get('routing.currentRouteName').endsWith('link-options')) {
                    this.get('routing').transitionTo('projects.project.spider');
                }
            });
        }
    }
});
