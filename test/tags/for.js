const Liquid = require('../..');
const chai = require("chai");
const expect = chai.expect;
chai.use(require("chai-as-promised"));

describe('tags/for', function() {
    var liquid, ctx;
    before(function() {
        liquid = Liquid();
        ctx = {
            one: 1,
            alpha: ['a', 'b', 'c'],
        };
    });
    it('should support for', function() {
        var src = '{%for c in alpha%}{{c}}{%endfor%}';
        return expect(liquid.parseAndRender(src, ctx))
            .to.eventually.equal('abc');
    });

    it('should throw when for not closed', function() {
        var src = '{%for c in alpha%}{{c}}';
        return expect(liquid.parseAndRender(src, ctx))
            .to.be.rejectedWith(/tag .* not closed/);
    });

    it('should support for else', function() {
        var src = '{%for c in ""%}a{%else%}b{%endfor%}';
        return expect(liquid.parseAndRender(src, ctx))
            .to.eventually.equal('b');
    });

    it('should support for with forloop', function() {
        var src = '{%for c in alpha%}' +
            '{{forloop.first}}.{{forloop.index}}.{{forloop.index0}}.' +
            '{{forloop.last}}.{{forloop.length}}.' +
            '{{forloop.rindex}}.{{forloop.rindex0}}' +
            '{{c}}\n' +
            '{%endfor%}';
        var dst = 'true.1.0.false.3.3.2a\n' +
            'false.2.1.false.3.2.1b\n' +
            'false.3.2.true.3.1.0c\n';
        return expect(liquid.parseAndRender(src, ctx))
            .to.eventually.equal(dst);
    });

    it('should support for with continue', function() {
        var src = '{% for i in (1..5) %}' +
            '{% if i == 4 %}{% continue %}' +
            '{% else %}{{ i }}' +
            '{% endif %}' +
            '{% endfor %}';
        return expect(liquid.parseAndRender(src, ctx))
            .to.eventually.equal('1235');
    });
    it('should support for with break', function() {
        src = '{% for i in (one..5) %}' +
            '{% if i == 4 %}{% break %}{% endif %}' +
            '{{ i }}' +
            '{% endfor %}';
        return expect(liquid.parseAndRender(src, ctx))
            .to.eventually.equal('123');
    });

    it('should support for with limit', function() {
        src = '{% for i in (1..5) limit:2 %}{{ i }}{% endfor %}';
        return expect(liquid.parseAndRender(src, ctx))
            .to.eventually.equal('12');
    });
    it('should support for with limit and offset', function() {
        src = '{% for i in (1..10) limit:2 offset:5%}{{ i }}{% endfor %}';
        return expect(liquid.parseAndRender(src, ctx))
            .to.eventually.equal('67');
    });

    it('should support for reversed', function() {
        src = '{% for i in (1..5) limit:2 reversed %}{{ i }}{% endfor %}';
        return expect(liquid.parseAndRender(src, ctx))
            .to.eventually.equal('21');
    });
});
