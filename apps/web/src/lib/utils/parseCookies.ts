export const parseCookies = (decodedCookies: string, key: string) => {
  try{
    const cookiesArray = decodedCookies.split("; ");
    
    for(let i = 0; i < cookiesArray.length; i++){
      if(cookiesArray[i].startsWith("token="))
      {
        const parts = cookiesArray[i].split("=");
        return parts[1];
      }
    }
    console.log("No token exists");
  } catch(err){
    console.log(err);
  }
}
