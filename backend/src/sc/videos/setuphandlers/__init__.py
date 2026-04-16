"""Hide upgrade profiles from the Plone installer UI."""

from plone.base.interfaces.installable import INonInstallable
from zope.interface import implementer


@implementer(INonInstallable)
class HiddenProfiles:
    """Prevent upgrade and uninstall profiles from appearing in the installer."""

    def getNonInstallableProfiles(self) -> list[str]:
        """Return profile IDs that should be hidden from quickinstaller.

        :returns: List of profile identifiers to hide.
        """
        return [
            "sc.videos:uninstall",
        ]

    def getNonInstallableProducts(self) -> list[str]:
        """Return product IDs that should be hidden from quickinstaller.

        :returns: List of product identifiers to hide.
        """
        return [
            "sc.videos.upgrades",
        ]
