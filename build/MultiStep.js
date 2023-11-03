"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importStar(require("react"));
const getTopNavStyles = (activeStep, length) => {
    const styles = [];
    for (let i = 0; i < length; i++) {
        if (i < activeStep) {
            styles.push('done');
        }
        else if (i === activeStep) {
            styles.push('doing');
        }
        else {
            styles.push('todo');
        }
    }
    return styles;
};
const getButtonsState = (activeStep, length, stepIsValid) => {
    if (activeStep === 0) {
        return {
            prevDisabled: true,
            nextDisabled: !stepIsValid
        };
    }
    if (activeStep > 0 && activeStep < (length - 1)) {
        return {
            prevDisabled: false,
            nextDisabled: !stepIsValid
        };
    }
    console.log(`stepIsValid: ${stepIsValid}`);
    return {
        prevDisabled: false,
        nextDisabled: !stepIsValid
    };
};
function MultiStep(props) {
    let { children } = props;
    if (!children) {
        throw TypeError("Error: No steps to show");
    }
    const containerStyle = typeof props.containerStyle === 'undefined' ? {} : props.containerStyle;
    const topNavStyle = typeof props.topNav === 'undefined' ? {} : props.topNav;
    const topNavStepStyle = typeof props.topNavStep === 'undefined' ? {} : props.topNavStep;
    const todoStyle = typeof props.todo === 'undefined' ? {} : props.todo;
    const doingStyle = typeof props.doing === 'undefined' ? {} : props.doing;
    const doneStyle = typeof props.done === 'undefined' ? {} : props.done;
    const [prevButton, setPrevButton] = (0, react_1.useState)(typeof props.prevButton === 'undefined' ? {} : props.prevButton);
    const [prevButtonHidden, setPrevButtonHidden] = (0, react_1.useState)(false);
    const nextButton = typeof props.nextButton === 'undefined' ? {} : props.nextButton;
    const [stepIsValid, setStepIsValid] = (0, react_1.useState)(false);
    const [stepAction, setStepAction] = (0, react_1.useState)(null);
    const stepStateChanged = (stepState) => {
        console.debug(`stepStateChanged: ${JSON.stringify(stepState)}`);
        if (stepState.nextStep !== undefined && stepState.nextStep != null && stepState.nextStep == 2) {
            console.debug(`stepStateChanged HIDING BUTTON`);
            setPrevButton({ style: { display: 'none' } });
            setPrevButtonHidden(true);
        }
        else {
            if (prevButtonHidden == true) {
                setPrevButton({ style: { display: 'inline-block' } });
                setPrevButtonHidden(false);
            }
        }
        if (stepState.isValid !== undefined)
            setStepIsValid(() => stepState.isValid);
        if (stepState.title)
            nextButton.title = stepState.title;
        if (stepState.action) {
            setStepAction(() => stepState.action);
        }
        else {
            setStepAction(null);
        }
    };
    children = react_1.default.Children.map(children, child => react_1.default.cloneElement(child, { signalParent: stepStateChanged }));
    let steps = children.map(child => ({
        title: child.props.title,
        component: child
    }));
    const [activeStep, setActiveStep] = (0, react_1.useState)(0);
    const [stylesState, setStylesState] = (0, react_1.useState)(getTopNavStyles(activeStep, steps.length));
    const [buttonsState, setButtonsState] = (0, react_1.useState)({
        prevDisabled: true,
        nextDisabled: true
    });
    (0, react_1.useEffect)(() => {
        setButtonsState(getButtonsState(activeStep, steps.length, stepIsValid));
    }, [activeStep, stepIsValid]);
    const setStepState = (activeStep) => {
        setStylesState(getTopNavStyles(activeStep, steps.length));
        setActiveStep(activeStep);
    };
    const next = () => {
        let newActiveStep = activeStep === steps.length - 1 ? activeStep : activeStep + 1;
        setStepState(newActiveStep);
        if (stepAction) {
            stepAction();
        }
    };
    const previous = () => {
        let newActiveStep = activeStep > 0 ? activeStep - 1 : activeStep;
        setStepState(newActiveStep);
    };
    const handleOnClick = (indx) => {
        if (!stepIsValid) {
            console.log('Error: Step validation failed');
            return;
        }
        if (indx === steps.length - 1 &&
            activeStep === steps.length - 1) {
            setStepState(steps.length);
        }
        else {
            setStepState(indx);
        }
    };
    const renderTopNav = () => steps.map((s, i) => {
        var _a, _b, _c;
        return ((0, jsx_runtime_1.jsx)("li", { style: Object.assign({}, topNavStepStyle), onClick: () => handleOnClick(i), children: stylesState[i] === 'doing' ?
                (0, jsx_runtime_1.jsx)("span", { style: doingStyle, children: (_a = s.title) !== null && _a !== void 0 ? _a : i + 1 }) :
                stylesState[i] === 'done' ?
                    (0, jsx_runtime_1.jsx)("span", { style: doneStyle, children: (_b = s.title) !== null && _b !== void 0 ? _b : i + 1 }) :
                    (0, jsx_runtime_1.jsx)("span", { style: todoStyle, children: (_c = s.title) !== null && _c !== void 0 ? _c : i + 1 }) }, i));
    });
    const renderButtonsNav = () => ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("button", { onClick: previous, style: buttonsState.prevDisabled ? prevButton === null || prevButton === void 0 ? void 0 : prevButton.disabledStyle : prevButton === null || prevButton === void 0 ? void 0 : prevButton.style, disabled: buttonsState.prevDisabled, children: prevButton && prevButton.title ? prevButton.title : 'Prev' }), (0, jsx_runtime_1.jsx)("button", { onClick: next, style: buttonsState.nextDisabled ? nextButton === null || nextButton === void 0 ? void 0 : nextButton.disabledStyle : nextButton === null || nextButton === void 0 ? void 0 : nextButton.style, disabled: buttonsState.nextDisabled, children: nextButton && nextButton.title ? nextButton.title : 'Next' })] }));
    return ((0, jsx_runtime_1.jsxs)("div", { style: Object.assign({}, containerStyle), children: [(0, jsx_runtime_1.jsx)("ol", { style: Object.assign({}, topNavStyle), children: renderTopNav() }), steps[activeStep].component, (0, jsx_runtime_1.jsx)("div", { children: renderButtonsNav() })] }));
}
exports.default = MultiStep;
