/*!
 * Piwik - free/libre analytics platform
 *
 * Screenshot integration tests.
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html GPL v3 or later
 */

describe("TwoFactorAuthUsersManager", function () {
    this.timeout(0);

    this.fixture = "Piwik\\Plugins\\TwoFactorAuth\\tests\\Fixtures\\TwoFactorUsersManagerFixture";

    var generalParams = 'idSite=1&period=day&date=2010-01-03',
        usersManager = '?module=UsersManager&action=index&' + generalParams;

    before(function () {
        testEnvironment.pluginsToLoad = ['TwoFactorAuth'];
        testEnvironment.save();
    });

    it('shows users with 2fa and not 2fa', async function () {
        await page.goto(usersManager);
        await page.evaluate(function () {
            $('td#last_seen').html(''); // fix random test failure
        });
        expect(await page.screenshotSelector('#content,#notificationContainer')).to.matchImage('list');
    });

    it('menu should show 2fa tab', async function () {
        await page.webpage.setViewport({
            width: 1250,
            height: 768
        });
        await page.click('#manageUsersTable #row2 .edituser');
        await page.evaluate(function () {
            $('.userEditForm .menuUserTwoFa a').click();
        });
        expect(await page.screenshotSelector('#content,#notificationContainer')).to.matchImage('edit_with_2fa');
    });

    it('should ask for confirmation before resetting 2fa', async function () {
        await page.click('.userEditForm .twofa-reset .resetTwoFa .btn');
        await page.waitFor(500);
        const modal = await page.$('.modal.open');
        expect(await modal.screenshot()).to.matchImage('edit_with_2fa_reset_confirm');
    });

    it('should be possible to confirm the reset', async function () {
        await page.click('.twofa-confirm-modal .modal-close:not(.modal-no)');
        await page.waitFor(250); // wait for modal to close
        expect(await page.screenshotSelector('#content,#notificationContainer')).to.matchImage('edit_with_2fa_reset_confirmed');
    });

});