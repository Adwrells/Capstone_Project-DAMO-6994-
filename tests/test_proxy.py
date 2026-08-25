"""
Healthcare Analytics Platform - Proxy Verification
"""

import unittest
import urllib.request
import json


class TestLiveNodeProxy(unittest.TestCase):
    def test_proxy_endpoints_if_server_active(self):
        endpoints = [
            'kpis',
            'trends',
            'ctas',
            'disposition',
            'regression',
            'demographics',
            'sex-disposition',
            'resource-burden',
            'main-problems',
            'hypotheses',
        ]
        # Check if server is running
        try:
            req = urllib.request.Request("http://127.0.0.1:3000/api/dashboard/kpis", headers={'Accept': 'application/json'})
            with urllib.request.urlopen(req, timeout=1) as response:
                if response.getcode() != 200:
                    self.skipTest("Node dev server not running on port 3000")
        except Exception:
            self.skipTest("Node dev server not running on port 3000")

        for ep in endpoints:
            url = f"http://127.0.0.1:3000/api/dashboard/{ep}"
            req = urllib.request.Request(url, headers={'Accept': 'application/json'})
            with urllib.request.urlopen(req, timeout=3) as response:
                self.assertEqual(response.getcode(), 200)
                content = json.loads(response.read().decode())
                self.assertTrue(content.get("success"))


if __name__ == "__main__":
    unittest.main()
