export const FPGAOL_URL = "https://fpgaol.ustc.edu.cn";

export const CAS_LOGIN_URL = "https://passport.ustc.edu.cn/login";
export const CAS_CAPTCHA_URL = "https://passport.ustc.edu.cn/validatecode.jsp?type=login";
export const CAS_RETURN_URL = "https://fpgaol.ustc.edu.cn/accounts/login_with_ticket";

export const CHECK_PAGE = "https://fpgaol.ustc.edu.cn/fpga/usage/";

export const HTTP_HEADER = {
    'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
    'accept-encoding': 'gzip, deflate, sdch, br',
    'accept-language': 'zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7,zh-TW;q=0.6',
    'connection': 'keep-alive',
    'upgrade-Insecure-Requests': '1',
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36'
};

export const DEVICE: Record<string, Record<string, string>> = {
    FPGAOL1: {
        TYPE: "FPGAOL1",
        NAME: "FPGAOL 1.0",
        ACQUIRE_URL: "https://fpgaol.ustc.edu.cn/fpga/acquire/?device_type=1",
        RELEASE_URL: "https://fpgaol.ustc.edu.cn/fpga/release/?device_type=1"
    },
    FPGAOL2: {
        TYPE: "FPGAOL2",
        NAME: "FPGAOL 2.0",
        ACQUIRE_URL: "https://fpgaol.ustc.edu.cn/fpga/acquire/?device_type=2",
        RELEASE_URL: "https://fpgaol.ustc.edu.cn/fpga/release/?device_type=2"
    },
    ZYBO: {
        TYPE: "ZYBO",
        NAME: "ZYBO Linaro",
        ACQUIRE_URL: "https://fpgaol.ustc.edu.cn/fpga/acquire/?device_type=3",
        RELEASE_URL: "https://fpgaol.ustc.edu.cn/fpga/release/?device_type=3"
    }
};

export enum COMPILE_URLS {
    SUBMIT = 'http://202.38.79.96:18888/submit',
    QUERY = 'http://202.38.79.96:18888/query/',
    DOWNLOAD = 'http://202.38.79.96:18888/download/',
    FILE = 'http://202.38.79.96:18887/'
};

export enum CHIP_TYPE {
    ARTIX7 = 'xc7a100tcsg324-1'
};

export const COMPILE_STATUS: Record<number, string> = {
    0: 'FATAL',
    1: 'RUNNING',
    2: 'PENDING',
    3: 'SUCCESS',
    4: 'FAILED'
};