/**
 * Complex number arithmetic library for interactive complex analysis visualizations.
 */
class Complex {
    constructor(re = 0, im = 0) {
        this.re = re;
        this.im = im;
    }

    static fromPolar(r, theta) {
        return new Complex(r * Math.cos(theta), r * Math.sin(theta));
    }

    static zero() { return new Complex(0, 0); }
    static one() { return new Complex(1, 0); }
    static i() { return new Complex(0, 1); }

    clone() { return new Complex(this.re, this.im); }

    add(b) {
        if (typeof b === 'number') return new Complex(this.re + b, this.im);
        return new Complex(this.re + b.re, this.im + b.im);
    }

    sub(b) {
        if (typeof b === 'number') return new Complex(this.re - b, this.im);
        return new Complex(this.re - b.re, this.im - b.im);
    }

    mul(b) {
        if (typeof b === 'number') return new Complex(this.re * b, this.im * b);
        return new Complex(
            this.re * b.re - this.im * b.im,
            this.re * b.im + this.im * b.re
        );
    }

    div(b) {
        if (typeof b === 'number') return new Complex(this.re / b, this.im / b);
        const denom = b.re * b.re + b.im * b.im;
        if (denom === 0) return new Complex(Infinity, Infinity);
        return new Complex(
            (this.re * b.re + this.im * b.im) / denom,
            (this.im * b.re - this.re * b.im) / denom
        );
    }

    conj() { return new Complex(this.re, -this.im); }
    neg() { return new Complex(-this.re, -this.im); }
    abs() { return Math.sqrt(this.re * this.re + this.im * this.im); }
    abs2() { return this.re * this.re + this.im * this.im; }
    arg() { return Math.atan2(this.im, this.re); }

    exp() {
        const r = Math.exp(this.re);
        return new Complex(r * Math.cos(this.im), r * Math.sin(this.im));
    }

    log() {
        return new Complex(Math.log(this.abs()), this.arg());
    }

    pow(b) {
        if (typeof b === 'number') b = new Complex(b, 0);
        const a = this.abs();
        if (a === 0) return Complex.zero();
        return this.log().mul(b).exp();
    }

    sqrt() {
        const r = this.abs();
        const t = this.arg();
        return Complex.fromPolar(Math.sqrt(r), t / 2);
    }

    sin() {
        return new Complex(
            Math.sin(this.re) * Math.cosh(this.im),
            Math.cos(this.re) * Math.sinh(this.im)
        );
    }

    cos() {
        return new Complex(
            Math.cos(this.re) * Math.cosh(this.im),
            -Math.sin(this.re) * Math.sinh(this.im)
        );
    }

    tan() { return this.sin().div(this.cos()); }

    sinh() {
        return new Complex(
            Math.sinh(this.re) * Math.cos(this.im),
            Math.cosh(this.re) * Math.sin(this.im)
        );
    }

    cosh() {
        return new Complex(
            Math.cosh(this.re) * Math.cos(this.im),
            Math.sinh(this.re) * Math.sin(this.im)
        );
    }

    tanh() { return this.sinh().div(this.cosh()); }

    inv() { return Complex.one().div(this); }

    dist(b) { return this.sub(b).abs(); }

    equals(b, eps = 1e-10) {
        return Math.abs(this.re - b.re) < eps && Math.abs(this.im - b.im) < eps;
    }

    toString(digits = 3) {
        const r = this.re.toFixed(digits);
        const i = Math.abs(this.im).toFixed(digits);
        if (Math.abs(this.im) < 1e-10) return `${r}`;
        if (Math.abs(this.re) < 1e-10) return `${this.im >= 0 ? '' : '-'}${i}i`;
        return `${r} ${this.im >= 0 ? '+' : '−'} ${i}i`;
    }

    toLatex(digits = 2) {
        const r = this.re.toFixed(digits);
        const i = Math.abs(this.im).toFixed(digits);
        if (Math.abs(this.im) < 1e-10) return r;
        if (Math.abs(this.re) < 1e-10) return `${this.im >= 0 ? '' : '-'}${i}i`;
        return `${r} ${this.im >= 0 ? '+' : '-'} ${i}i`;
    }

    toPolar(digits = 3) {
        return { r: this.abs().toFixed(digits), theta: this.arg().toFixed(digits) };
    }

    /**
     * Evaluate a mathematical expression string at a given z value.
     * Supports: z, +, -, *, /, ^, sin, cos, tan, exp, log, conj, sqrt, i, pi, e
     */
    static parse(expr, z) {
        try {
            const sanitized = expr.replace(/[^0-9a-zA-Z+\-*/^()._, ]/g, '');
            const transformed = sanitized
                .replace(/\bpi\b/g, 'PI')
                .replace(/\be\b/g, 'E')
                .replace(/\bi\b/g, 'I')
                .replace(/\bz\b/g, 'Z')
                .replace(/\bsin\b/g, 'SIN')
                .replace(/\bcos\b/g, 'COS')
                .replace(/\btan\b/g, 'TAN')
                .replace(/\bexp\b/g, 'EXP')
                .replace(/\blog\b/g, 'LOG')
                .replace(/\bsqrt\b/g, 'SQRT')
                .replace(/\bconj\b/g, 'CONJ')
                .replace(/\babs\b/g, 'ABS')
                .replace(/\bsinh\b/g, 'SINH')
                .replace(/\bcosh\b/g, 'COSH');

            const tokens = tokenize(transformed);
            const ast = parseExpr(tokens, 0);
            return evalAST(ast.node, z);
        } catch (e) {
            return Complex.zero();
        }
    }
}

/* ---------- Expression parser for Complex.parse ---------- */
function tokenize(s) {
    const tokens = [];
    let i = 0;
    while (i < s.length) {
        if (s[i] === ' ') { i++; continue; }
        if ('+-*/^(),'.includes(s[i])) {
            tokens.push({ type: 'op', value: s[i] });
            i++;
        } else if (/[0-9.]/.test(s[i])) {
            let num = '';
            while (i < s.length && /[0-9.]/.test(s[i])) { num += s[i]; i++; }
            tokens.push({ type: 'num', value: parseFloat(num) });
        } else if (/[A-Za-z_]/.test(s[i])) {
            let id = '';
            while (i < s.length && /[A-Za-z_]/.test(s[i])) { id += s[i]; i++; }
            tokens.push({ type: 'id', value: id });
        } else {
            i++;
        }
    }
    return tokens;
}

function parseExpr(tokens, pos) {
    let left = parseTerm(tokens, pos);
    while (left.pos < tokens.length && tokens[left.pos] &&
        (tokens[left.pos].value === '+' || tokens[left.pos].value === '-')) {
        const op = tokens[left.pos].value;
        const right = parseTerm(tokens, left.pos + 1);
        left = { node: { type: 'binop', op, left: left.node, right: right.node }, pos: right.pos };
    }
    return left;
}

function parseTerm(tokens, pos) {
    let left = parsePower(tokens, pos);
    while (left.pos < tokens.length && tokens[left.pos] &&
        (tokens[left.pos].value === '*' || tokens[left.pos].value === '/')) {
        const op = tokens[left.pos].value;
        const right = parsePower(tokens, left.pos + 1);
        left = { node: { type: 'binop', op, left: left.node, right: right.node }, pos: right.pos };
    }
    return left;
}

function parsePower(tokens, pos) {
    let base = parseUnary(tokens, pos);
    if (base.pos < tokens.length && tokens[base.pos] && tokens[base.pos].value === '^') {
        const exp = parsePower(tokens, base.pos + 1);
        return { node: { type: 'binop', op: '^', left: base.node, right: exp.node }, pos: exp.pos };
    }
    return base;
}

function parseUnary(tokens, pos) {
    if (pos < tokens.length && tokens[pos].value === '-') {
        const inner = parseUnary(tokens, pos + 1);
        return { node: { type: 'neg', child: inner.node }, pos: inner.pos };
    }
    if (pos < tokens.length && tokens[pos].value === '+') {
        return parseUnary(tokens, pos + 1);
    }
    return parseAtom(tokens, pos);
}

function parseAtom(tokens, pos) {
    if (pos >= tokens.length) return { node: { type: 'num', value: 0 }, pos };
    const tok = tokens[pos];
    if (tok.type === 'num') {
        return { node: { type: 'num', value: tok.value }, pos: pos + 1 };
    }
    if (tok.type === 'id') {
        const funcNames = ['SIN', 'COS', 'TAN', 'EXP', 'LOG', 'SQRT', 'CONJ', 'ABS', 'SINH', 'COSH'];
        if (funcNames.includes(tok.value)) {
            if (tokens[pos + 1] && tokens[pos + 1].value === '(') {
                const inner = parseExpr(tokens, pos + 2);
                const closePos = inner.pos; // should be ')'
                return { node: { type: 'func', name: tok.value, arg: inner.node }, pos: closePos + 1 };
            }
        }
        return { node: { type: 'var', name: tok.value }, pos: pos + 1 };
    }
    if (tok.value === '(') {
        const inner = parseExpr(tokens, pos + 1);
        return { node: inner.node, pos: inner.pos + 1 };
    }
    return { node: { type: 'num', value: 0 }, pos: pos + 1 };
}

function evalAST(node, z) {
    switch (node.type) {
        case 'num': return new Complex(node.value, 0);
        case 'var':
            if (node.name === 'Z') return z.clone();
            if (node.name === 'I') return Complex.i();
            if (node.name === 'PI') return new Complex(Math.PI, 0);
            if (node.name === 'E') return new Complex(Math.E, 0);
            return Complex.zero();
        case 'neg': return evalAST(node.child, z).neg();
        case 'binop': {
            const l = evalAST(node.left, z);
            const r = evalAST(node.right, z);
            switch (node.op) {
                case '+': return l.add(r);
                case '-': return l.sub(r);
                case '*': return l.mul(r);
                case '/': return l.div(r);
                case '^': return l.pow(r);
            }
        }
        case 'func': {
            const a = evalAST(node.arg, z);
            switch (node.name) {
                case 'SIN': return a.sin();
                case 'COS': return a.cos();
                case 'TAN': return a.tan();
                case 'EXP': return a.exp();
                case 'LOG': return a.log();
                case 'SQRT': return a.sqrt();
                case 'CONJ': return a.conj();
                case 'ABS': return new Complex(a.abs(), 0);
                case 'SINH': return a.sinh();
                case 'COSH': return a.cosh();
            }
        }
        default: return Complex.zero();
    }
}

/* ---------- Preset function library ---------- */
Complex.presets = {
    'z': z => z.clone(),
    'z²': z => z.mul(z),
    'z³': z => z.mul(z).mul(z),
    '1/z': z => Complex.one().div(z),
    'z + 1/z': z => z.add(Complex.one().div(z)),
    'sin(z)': z => z.sin(),
    'cos(z)': z => z.cos(),
    'exp(z)': z => z.exp(),
    'log(z)': z => z.log(),
    'sqrt(z)': z => z.sqrt(),
    '(z²−1)/(z²+1)': z => z.mul(z).sub(Complex.one()).div(z.mul(z).add(Complex.one())),
    'z·exp(1/z)': z => z.mul(Complex.one().div(z).exp()),
    'tan(z)': z => z.tan(),
    '1/(z²+1)': z => Complex.one().div(z.mul(z).add(Complex.one())),
};
