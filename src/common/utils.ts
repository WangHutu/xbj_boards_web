
export class LocalVue {
    static getLocal = (name:any) => {
      return localStorage.getItem(name)
    }
    
    static setLocal = (name:any, value:any) => {
      localStorage.setItem(name, JSON.stringify(value))
    }
}
