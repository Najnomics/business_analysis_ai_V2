import requests
import json
import time
from datetime import datetime

class SomnaAITester:
    def __init__(self, base_url):
        self.base_url = base_url
        self.token = None
        self.user_id = None
        self.tests_run = 0
        self.tests_passed = 0
        self.analysis_id = None

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        
        if headers is None:
            headers = {'Content-Type': 'application/json'}
            if self.token:
                headers['Authorization'] = f'Bearer {self.token}'

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    return success, response.json()
                except:
                    return success, {}
            else:
                print(f"❌ Failed - Status: {response.status_code}")
                try:
                    print(f"Response: {response.json()}")
                except:
                    print(f"Response: {response.text}")
                return False, {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_health_check(self):
        """Test the health check endpoint"""
        success, response = self.run_test(
            "Health Check",
            "GET",
            "api",
            200
        )
        if success:
            print(f"Message: {response.get('message')}")
            print(f"Version: {response.get('version')}")
            print(f"Powered by: {response.get('powered_by')}")
        return success

    def test_register(self, name, email, password):
        """Test user registration"""
        success, response = self.run_test(
            "User Registration",
            "POST",
            "api/auth/register",
            200,
            data={"name": name, "email": email, "password": password}
        )
        if success and 'access_token' in response:
            self.token = response['access_token']
            self.user_id = response['user']['id']
            print(f"User registered with ID: {self.user_id}")
            return True
        return False

    def test_login(self, email, password):
        """Test user login"""
        success, response = self.run_test(
            "User Login",
            "POST",
            "api/auth/login",
            200,
            data={"email": email, "password": password}
        )
        if success and 'access_token' in response:
            self.token = response['access_token']
            self.user_id = response['user']['id']
            print(f"User logged in with ID: {self.user_id}")
            return True
        return False

    def test_create_analysis(self):
        """Test creating a business analysis"""
        data = {
            "business_idea": "An AI-powered sustainable fashion marketplace that connects eco-conscious consumers with verified sustainable brands",
            "industry": "Fashion Technology",
            "stage": "seed",
            "target_market": "Environmentally conscious millennials and Gen Z consumers",
            "analysis_types": ["swot", "pestel"],
            "ai_models": ["deepseek", "gemini"],
            "consensus_mode": True,
            "depth": "comprehensive"
        }
        
        success, response = self.run_test(
            "Create Business Analysis",
            "POST",
            "api/analysis/business",
            200,
            data=data
        )
        
        if success and 'id' in response:
            self.analysis_id = response['id']
            print(f"Analysis created with ID: {self.analysis_id}")
            print(f"Analysis types: {response.get('analysis_types', [])}")
            print(f"Confidence score: {response.get('confidence_score', 0)}")
            return True
        return False

    def test_get_analysis_history(self):
        """Test getting analysis history"""
        success, response = self.run_test(
            "Get Analysis History",
            "GET",
            "api/analysis/history",
            200
        )
        
        if success:
            analyses_count = len(response)
            print(f"Retrieved {analyses_count} analyses from history")
            return True
        return False

    def test_get_analysis_detail(self):
        """Test getting a specific analysis"""
        if not self.analysis_id:
            print("❌ No analysis ID available for testing")
            return False
            
        success, response = self.run_test(
            "Get Analysis Detail",
            "GET",
            f"api/analysis/{self.analysis_id}",
            200
        )
        
        if success:
            print(f"Retrieved analysis: {response.get('business_idea', '')}")
            return True
        return False

def main():
    # Setup
    base_url = "http://localhost:8001"
    tester = SomnaAITester(base_url)
    
    # Test credentials
    test_name = "Demo User"
    test_email = "demo@somna.ai"
    test_password = "demo123"
    
    # Run tests
    print("\n===== SOMNA AI API TESTING =====")
    print(f"Testing against: {base_url}")
    print("================================\n")
    
    # Test health check
    tester.test_health_check()
    
    # Test registration
    if tester.test_register(test_name, test_email, test_password):
        print("Registration successful")
    else:
        # If registration fails, try login
        print("Registration failed, trying login...")
        if not tester.test_login(test_email, test_password):
            print("❌ Both registration and login failed, stopping tests")
            return 1
    
    # Test creating analysis
    if tester.test_create_analysis():
        print("Analysis creation successful")
    else:
        print("❌ Analysis creation failed")
    
    # Test getting analysis history
    if tester.test_get_analysis_history():
        print("Getting analysis history successful")
    else:
        print("❌ Getting analysis history failed")
    
    # Test getting analysis detail
    if tester.test_get_analysis_detail():
        print("Getting analysis detail successful")
    else:
        print("❌ Getting analysis detail failed")
    
    # Print results
    print("\n===== TEST RESULTS =====")
    print(f"Tests passed: {tester.tests_passed}/{tester.tests_run}")
    print(f"Success rate: {(tester.tests_passed/tester.tests_run)*100 if tester.tests_run > 0 else 0:.2f}%")
    print("========================\n")
    
    return 0 if tester.tests_passed == tester.tests_run else 1

if __name__ == "__main__":
    main()