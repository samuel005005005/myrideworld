import 'package:flutter/material.dart';

import '../../../../core/constants/app_strings.dart';

class LoginPage extends StatelessWidget {
  const LoginPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text(AppStrings.loginTitle)),
      body: Center(
        child: ElevatedButton(
          onPressed: () {},
          child: const Text(AppStrings.loginButton),
        ),
      ),
    );
  }
}
