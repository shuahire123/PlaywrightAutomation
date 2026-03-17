import {test,expect,Locator,Page} from '@playwright/test';
test('Test Case : Retrieve the CPU Load value for the Chrome process and compare it against the value displayed in the yellow label.', async({page})=>
{
    await page.goto('https://testautomationpractice.blogspot.com/');
    //get cpu load of chrome process
    let chromeCpuLoad:string=(await page.locator("//td[contains(text(),'Chrome')]/following-sibling::td[contains(text(),'%')]").innerText()).replace('%','');
    console.log(chromeCpuLoad);
    let chromeProcess:string=(await page.locator('strong.chrome-cpu').innerText()).replace('%','');
    expect(chromeCpuLoad).toEqual(chromeProcess);
    
});
test('Retrieve the Memory Usage value for the Firefox process and compare it against the value displayed in the blue label.',async({page})=>
{
    await page.goto('https://testautomationpractice.blogspot.com/');
    let  memoryUsageFF:string=(await page.locator("//td[contains(text(),'Firefox')]/following-sibling::td[not(contains(text(),'/')) and contains(text(),'MB')]").innerText()).replace(' MB','');
    let memoryUsageTarget:string=(await page.locator("strong.firefox-memory").innerText()).replace(' MB','');
    expect(memoryUsageFF).toEqual(memoryUsageTarget);
    console.log(memoryUsageFF,memoryUsageTarget);

});
test('Retrieve the Network Speed value for the Chrome process and compare it against the value displayed in the orange label.',async({page})=>
{
    await page.goto('https://testautomationpractice.blogspot.com/');
    let chromeNetworkSpeed:string =(await page.locator("//td[contains(text(),'Chrome')]/following-sibling::td[contains(text(),'Mbps')]").innerText()).replace(' Mbps','');
    let chromeNetwoekSpeedTarget:string = (await page.locator('strong.chrome-network').innerText()).replace(' Mbps','');
    expect(chromeNetworkSpeed).toEqual(chromeNetwoekSpeedTarget);
});
test.only('Retrieve the Disk Space value for the Firefox process and compare it against the value displayed in the violet label.',async({page})=>
{
    await page.goto('https://testautomationpractice.blogspot.com/');
    let diskSpace:string= (await page.locator("//td[contains(text(),'Firefox')]/following-sibling::td[contains(text(),'MB/s')]").innerText()).replace(/\s*MB\/s/, '');
    let diskSpaceTraget=(await page.locator("strong.firefox-disk").textContent())?.replace(' MB/s','');
    expect(diskSpace).toEqual(diskSpaceTraget);

})