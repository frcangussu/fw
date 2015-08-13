describe("", function() {
  var rootEl;
  beforeEach(function() {
    rootEl = browser.rootEl;
    browser.get("examples/example-$route-service/index-jquery.html");
  });
  
  it('should load and compile correct template', function() {
    element(by.linkText('Moby: Ch1')).click();
    var content = element(by.css('[ng-view]')).getText();
    expect(content).toMatch(/controller\: ChapterController/);
    expect(content).toMatch(/Book Id\: Moby/);
    expect(content).toMatch(/Chapter Id\: 1/);

    element(by.partialLinkText('Scarlet')).click();

    content = element(by.css('[ng-view]')).getText();
    expect(content).toMatch(/controller\: BookController/);
    expect(content).toMatch(/Book Id\: Scarlet/);
  });
});